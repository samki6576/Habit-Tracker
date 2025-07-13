import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, Timestamp } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import type { Habit, SharedHabit } from "@/lib/types"

// Generate a random share code
export function generateShareCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// Create a shareable link for a habit
export function createShareableLink(shareCode: string): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  return `${baseUrl}/share/${shareCode}`
}

// Share a habit with a friend
export async function shareHabit(habit: Habit): Promise<SharedHabit | null> {
  if (!auth?.currentUser) throw new Error("User not authenticated")

  // Demo mode
  if (!db || habit.id.startsWith("demo-")) {
    const shareCode = generateShareCode()
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setDate(expiresAt.getDate() + 7) // Expires in 7 days

    const sharedHabit: SharedHabit = {
      id: `demo-share-${Date.now()}`,
      habitId: habit.id,
      title: habit.title,
      description: habit.description,
      category: habit.category,
      sharedBy: auth.currentUser.email || "demo@example.com",
      sharedAt: now.toISOString(),
      shareCode,
      expiresAt: expiresAt.toISOString(),
      claimed: false,
    }

    // Store in localStorage
    const sharedHabits = getSharedHabitsFromLocalStorage()
    sharedHabits.push(sharedHabit)
    localStorage.setItem("sharedHabits", JSON.stringify(sharedHabits))

    return sharedHabit
  }

  try {
    const shareCode = generateShareCode()
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setDate(expiresAt.getDate() + 7) // Expires in 7 days

    const sharedHabitData = {
      habitId: habit.id,
      title: habit.title,
      description: habit.description,
      category: habit.category,
      sharedBy: auth.currentUser.email,
      sharedAt: Timestamp.now(),
      shareCode,
      expiresAt: Timestamp.fromDate(expiresAt),
      claimed: false,
    }

    const docRef = await addDoc(collection(db, "sharedHabits"), sharedHabitData)

    return {
      id: docRef.id,
      ...sharedHabitData,
      sharedBy: auth.currentUser.email || "unknown@example.com",
      sharedAt: now,
      expiresAt,
    }
  } catch (error) {
    console.error("Error sharing habit:", error)
    return null
  }
}

// Get shared habits from localStorage (for demo mode)
function getSharedHabitsFromLocalStorage(): SharedHabit[] {
  const sharedHabits = localStorage.getItem("sharedHabits")
  return sharedHabits ? JSON.parse(sharedHabits) : []
}

// Get a shared habit by share code
export async function getSharedHabitByCode(shareCode: string): Promise<SharedHabit | null> {
  // Demo mode
  if (!db) {
    const sharedHabits = getSharedHabitsFromLocalStorage()
    const sharedHabit = sharedHabits.find((h) => h.shareCode === shareCode)

    if (!sharedHabit) return null

    // Check if expired
    if (new Date(sharedHabit.expiresAt) < new Date()) return null

    return sharedHabit
  }

  try {
    const q = query(collection(db, "sharedHabits"), where("shareCode", "==", shareCode))

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) return null

    const doc = querySnapshot.docs[0]
    const data = doc.data()

    // Check if expired
    if (data.expiresAt.toDate() < new Date()) return null

    return {
      id: doc.id,
      habitId: data.habitId,
      title: data.title,
      description: data.description,
      category: data.category,
      sharedBy: data.sharedBy,
      sharedAt: data.sharedAt.toDate(),
      shareCode: data.shareCode,
      expiresAt: data.expiresAt.toDate(),
      claimed: data.claimed,
    }
  } catch (error) {
    console.error("Error getting shared habit:", error)
    return null
  }
}

// Import a shared habit
export async function importSharedHabit(sharedHabit: SharedHabit): Promise<Habit | null> {
  if (!auth?.currentUser) throw new Error("User not authenticated")

  // Demo mode
  if (!db || sharedHabit.id.startsWith("demo-share-")) {
    const now = new Date()

    const habit: Habit = {
      id: `demo-${Date.now()}`,
      title: sharedHabit.title,
      description: sharedHabit.description,
      category: sharedHabit.category,
      createdAt: now.toISOString(),
      doneDates: [],
      sharedBy: sharedHabit.sharedBy,
      sharedAt: now.toISOString(),
    }

    // Add to demo habits
    const demoHabits = JSON.parse(localStorage.getItem("demoHabits") || "[]")
    demoHabits.push(habit)
    localStorage.setItem("demoHabits", JSON.stringify(demoHabits))

    // Mark as claimed
    const sharedHabits = getSharedHabitsFromLocalStorage()
    const index = sharedHabits.findIndex((h) => h.id === sharedHabit.id)
    if (index !== -1) {
      sharedHabits[index].claimed = true
      localStorage.setItem("sharedHabits", JSON.stringify(sharedHabits))
    }

    return habit
  }

  try {
    // Create new habit
    const habitData = {
      title: sharedHabit.title,
      description: sharedHabit.description,
      category: sharedHabit.category,
      userId: auth.currentUser.uid,
      createdAt: Timestamp.now(),
      doneDates: [],
      sharedBy: sharedHabit.sharedBy,
      sharedAt: Timestamp.now(),
    }

    const habitRef = await addDoc(collection(db, "habits"), habitData)

    // Mark shared habit as claimed
    await updateDoc(doc(db, "sharedHabits", sharedHabit.id), {
      claimed: true,
    })

    return {
      id: habitRef.id,
      title: sharedHabit.title,
      description: sharedHabit.description,
      category: sharedHabit.category,
      createdAt: new Date(),
      doneDates: [],
      sharedBy: sharedHabit.sharedBy,
      sharedAt: new Date(),
    }
  } catch (error) {
    console.error("Error importing shared habit:", error)
    return null
  }
}

// Get habits shared by the current user
export async function getHabitsSharedByUser(): Promise<SharedHabit[]> {
  if (!auth?.currentUser) throw new Error("User not authenticated")

  // Demo mode
  if (!db) {
    const sharedHabits = getSharedHabitsFromLocalStorage()
    const userEmail = auth && auth.currentUser ? auth.currentUser.email : null
    return sharedHabits.filter((h) => h.sharedBy === userEmail)
  }

  try {
    const q = query(collection(db, "sharedHabits"), where("sharedBy", "==", auth.currentUser.email))

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        habitId: data.habitId,
        title: data.title,
        description: data.description,
        category: data.category,
        sharedBy: data.sharedBy,
        sharedAt: data.sharedAt.toDate(),
        shareCode: data.shareCode,
        expiresAt: data.expiresAt.toDate(),
        claimed: data.claimed,
      }
    })
  } catch (error) {
    console.error("Error getting shared habits:", error)
    return []
  }
}

// Delete a shared habit
export async function deleteSharedHabit(sharedHabitId: string): Promise<boolean> {
  if (!auth?.currentUser) throw new Error("User not authenticated")

  // Demo mode
  if (!db || sharedHabitId.startsWith("demo-share-")) {
    const sharedHabits = getSharedHabitsFromLocalStorage()
    const updatedSharedHabits = sharedHabits.filter((h) => h.id !== sharedHabitId)
    localStorage.setItem("sharedHabits", JSON.stringify(updatedSharedHabits))
    return true
  }

  try {
    await deleteDoc(doc(db, "sharedHabits", sharedHabitId))
    return true
  } catch (error) {
    console.error("Error deleting shared habit:", error)
    return false
  }
}

// Send a habit invitation via email (mock implementation)
export async function sendHabitInvitation(email: string, shareCode: string, habitTitle: string): Promise<boolean> {
  // In a real app, this would send an email via a server function
  // For this demo, we'll just log the invitation and return success
  console.log(`Invitation sent to ${email} for habit "${habitTitle}" with code ${shareCode}`)

  // Mock successful email sending
  return true
}
