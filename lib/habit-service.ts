import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
  getDoc,
} from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import type { Habit, HabitFormData } from "@/lib/types"
import { getTodayDate } from "@/lib/utils"

// Demo mode data for when Firestore isn't available or has permission issues
const DEMO_HABITS_KEY = "demoHabits"

// Initialize demo habits if not already in localStorage
const initDemoHabits = () => {
  if (!localStorage.getItem(DEMO_HABITS_KEY)) {
    const defaultHabits: Habit[] = [
      {
        id: "demo-1",
        title: "Drink Water",
        description: "Drink at least 8 glasses of water daily",
        createdAt: new Date().toISOString(),
        doneDates: [getTodayDate()],
      },
      {
        id: "demo-2",
        title: "Exercise",
        description: "30 minutes of physical activity",
        createdAt: new Date().toISOString(),
        doneDates: [],
      },
      {
        id: "demo-3",
        title: "Read",
        description: "Read for 20 minutes before bed",
        createdAt: new Date().toISOString(),
        doneDates: [
          getTodayDate(),
          new Date(Date.now() - 86400000).toISOString().split("T")[0], // yesterday
        ],
        reminder: {
          enabled: true,
          time: "21:00",
          days: [0, 1, 2, 3, 4, 5, 6], // Every day
        },
      },
    ]
    localStorage.setItem(DEMO_HABITS_KEY, JSON.stringify(defaultHabits))
  }
}

// Get demo habits from localStorage
const getDemoHabits = (): Habit[] => {
  initDemoHabits()
  const habits = localStorage.getItem(DEMO_HABITS_KEY)
  return habits ? JSON.parse(habits) : []
}

// Save demo habits to localStorage
const saveDemoHabits = (habits: Habit[]) => {
  localStorage.setItem(DEMO_HABITS_KEY, JSON.stringify(habits))
}

// Check if we're in demo mode (no Firestore or not authenticated)
const isInDemoMode = () => !db || !auth?.currentUser

// Collection reference
const getHabitsCollection = () => {
  if (!db) throw new Error("Firestore is not initialized")
  return collection(db, "habits")
}

// Create a new habit
export async function createHabit(habitData: HabitFormData): Promise<Habit | null> {
  // In demo mode, return a mock habit
  if (isInDemoMode()) {
    const demoHabits = getDemoHabits()
    const newHabit: Habit = {
      id: `demo-${Date.now()}`,
      title: habitData.title,
      description: habitData.description,
      createdAt: new Date().toISOString(),
      doneDates: [],
      reminder: habitData.reminder,
    }

    // Add to demo habits
    demoHabits.push(newHabit)
    saveDemoHabits(demoHabits)
    return newHabit
  }

  if (!auth?.currentUser) throw new Error("User not authenticated")
  if (!db) throw new Error("Firestore is not initialized")

  try {
    const newHabit = {
      ...habitData,
      userId: auth.currentUser.uid,
      createdAt: Timestamp.now(),
      doneDates: [],
    }

    const docRef = await addDoc(getHabitsCollection(), newHabit)

    return {
      id: docRef.id,
      title: habitData.title,
      description: habitData.description,
      createdAt: new Date(),
      doneDates: [],
      reminder: habitData.reminder,
    }
  } catch (error) {
    console.error("Error creating habit:", error)
    throw new Error("Failed to create habit. Please check your Firestore permissions.")
  }
}

// Get all habits for the current user
export async function getUserHabits(): Promise<Habit[]> {
  // In demo mode, return demo habits
  if (isInDemoMode()) {
    console.log("Using demo habits data")
    return getDemoHabits()
  }

  if (!auth?.currentUser) throw new Error("User not authenticated")
  if (!db) throw new Error("Firestore is not initialized")

  try {
    const q = query(getHabitsCollection(), where("userId", "==", auth.currentUser.uid))

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        createdAt: data.createdAt.toDate(),
        doneDates: data.doneDates || [],
        reminder: data.reminder,
      }
    })
  } catch (error) {
    console.error("Error fetching habits:", error)

    // If we get a permission error, switch to demo mode
    console.log("Falling back to demo habits data")
    return getDemoHabits()
  }
}

// Mark a habit as done for today
export async function markHabitAsDone(habitId: string): Promise<boolean> {
  // In demo mode, update the demo habit
  if (isInDemoMode() || habitId.startsWith("demo-")) {
    const habits = getDemoHabits()
    const habitIndex = habits.findIndex((h) => h.id === habitId)

    if (habitIndex !== -1) {
      const today = getTodayDate()
      if (!habits[habitIndex].doneDates.includes(today)) {
        habits[habitIndex].doneDates.push(today)
        saveDemoHabits(habits)
      }
      return true
    }
    return false
  }

  if (!auth?.currentUser) throw new Error("User not authenticated")
  if (!db) throw new Error("Firestore is not initialized")

  try {
    const habitRef = doc(db, "habits", habitId)
    const habitDoc = await getDoc(habitRef)

    if (!habitDoc.exists()) throw new Error("Habit not found")

    const habitData = habitDoc.data()
    const doneDates = habitData.doneDates || []
    const today = getTodayDate()

    // If today is already marked, do nothing
    if (doneDates.includes(today)) return true

    // Add today to doneDates
    await updateDoc(habitRef, {
      doneDates: [...doneDates, today],
    })

    return true
  } catch (error) {
    console.error("Error marking habit as done:", error)

    // If in demo mode or using demo habits, update the demo habit
    if (habitId.startsWith("demo-")) {
      const habits = getDemoHabits()
      const habitIndex = habits.findIndex((h) => h.id === habitId)

      if (habitIndex !== -1) {
        const today = getTodayDate()
        if (!habits[habitIndex].doneDates.includes(today)) {
          habits[habitIndex].doneDates.push(today)
          saveDemoHabits(habits)
        }
        return true
      }
    }

    throw new Error("Failed to mark habit as done. Please check your Firestore permissions.")
  }
}

// Unmark a habit as done for today
export async function unmarkHabitAsDone(habitId: string): Promise<boolean> {
  // In demo mode, update the demo habit
  if (isInDemoMode() || habitId.startsWith("demo-")) {
    const habits = getDemoHabits()
    const habitIndex = habits.findIndex((h) => h.id === habitId)

    if (habitIndex !== -1) {
      const today = getTodayDate()
      habits[habitIndex].doneDates = habits[habitIndex].doneDates.filter((date) => date !== today)
      saveDemoHabits(habits)
      return true
    }
    return false
  }

  if (!auth?.currentUser) throw new Error("User not authenticated")
  if (!db) throw new Error("Firestore is not initialized")

  try {
    const habitRef = doc(db, "habits", habitId)
    const habitDoc = await getDoc(habitRef)

    if (!habitDoc.exists()) throw new Error("Habit not found")

    const habitData = habitDoc.data()
    const doneDates = habitData.doneDates || []
    const today = getTodayDate()

    // Remove today from doneDates
    const updatedDoneDates = doneDates.filter((date) => date !== today)

    await updateDoc(habitRef, {
      doneDates: updatedDoneDates,
    })

    return true
  } catch (error) {
    console.error("Error unmarking habit as done:", error)

    // If in demo mode or using demo habits, update the demo habit
    if (habitId.startsWith("demo-")) {
      const habits = getDemoHabits()
      const habitIndex = habits.findIndex((h) => h.id === habitId)

      if (habitIndex !== -1) {
        const today = getTodayDate()
        habits[habitIndex].doneDates = habits[habitIndex].doneDates.filter((date) => date !== today)
        saveDemoHabits(habits)
        return true
      }
    }

    throw new Error("Failed to unmark habit as done. Please check your Firestore permissions.")
  }
}

// Delete a habit
export async function deleteHabit(habitId: string): Promise<boolean> {
  // In demo mode, remove from demo habits
  if (isInDemoMode() || habitId.startsWith("demo-")) {
    const habits = getDemoHabits()
    const updatedHabits = habits.filter((h) => h.id !== habitId)
    saveDemoHabits(updatedHabits)
    return true
  }

  if (!auth?.currentUser) throw new Error("User not authenticated")
  if (!db) throw new Error("Firestore is not initialized")

  try {
    await deleteDoc(doc(db, "habits", habitId))
    return true
  } catch (error) {
    console.error("Error deleting habit:", error)

    // If in demo mode or using demo habits, remove from demo habits
    if (habitId.startsWith("demo-")) {
      const habits = getDemoHabits()
      const updatedHabits = habits.filter((h) => h.id !== habitId)
      saveDemoHabits(updatedHabits)
      return true
    }

    throw new Error("Failed to delete habit. Please check your Firestore permissions.")
  }
}
