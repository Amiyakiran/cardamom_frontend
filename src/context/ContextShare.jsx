import { createContext, useContext, useEffect, useState } from "react"
import { getMeApi } from "../services/allApi"

export const AuthContext = createContext()

const ContextShare = ({ children }) => {

  const [user, setUser] = useState("")
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    // console.log("checkAuth running")
    try {
      const result = await getMeApi()
      // console.log("raw result:", result)
      // console.log("status:", result?.status)

      if (result?.status === 200) {
        setUser(result.data.user.name)
      } else {
        setUser("")
      }
    } catch (error) {
      setUser("")
    } finally {
      setLoading(false)
    }
  }
  // console.log(user)

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
export default ContextShare

// export const useAuth = () => {
//   return useContext(AuthContext)
// }