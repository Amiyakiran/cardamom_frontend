import { createContext, useContext, useEffect, useState } from "react"
import { getMeApi } from "../services/allApi"

export const AuthContext = createContext()

const ContextShare = ({ children }) => {

  const [user, setUser] = useState("")
   const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(true)


  const checkAuth = async () => {
    // console.log("checkAuth running")
    try {
      const result = await getMeApi()
      // console.log("raw result:", result)
      // console.log("status:", result?.status)

      if (result?.status === 200) {
        setUser(result.data.user.name)
        setUserId(result.data.user.id)
      } else {
        setUser("")
        setUserId("")
      }
    } catch (error) {
      setUser("")
      setUserId("")
    } finally {
      setLoading(false)
    }
  }
  // console.log(user)

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, userId, setUserId, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
export default ContextShare

// export const useAuth = () => {
//   return useContext(AuthContext)
// }