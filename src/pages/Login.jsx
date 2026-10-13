import React, { useContext, useState } from 'react' // React state hook for form inputs
import './Login.css' // Import the login page styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Icon component
import { faLock, faEye, faEyeSlash, faArrowRight } from '@fortawesome/free-solid-svg-icons' // Solid icons used on the page
import { faUser } from '@fortawesome/free-regular-svg-icons'; // Regular user icon
import { registerApi, loginApi, googleLoginApi, forgotPasswordApi, resetPasswordApi } from '../services/allApi' // Import the register API function
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom' // React Router hook for navigation
import Footer from '../components/Footer'
import { Link } from 'react-router-dom' // React Router link component
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../context/ContextShare';




export default function Login({ register, forgetPassword, reset_password }) {
  const [name, setName] = useState('') // Stores the name entered during registration
  const [email, setEmail] = useState('') // Stores the email entered by the user
  const [password, setPassword] = useState('') // Stores the password entered by the user
  const [confirmPassword, setConfirmPassword] = useState('') // Stores the password entered by the user
  const [showPassword, setShowPassword] = useState(false) // Toggles password visibility
  const [showPswd, setShowPswd] = useState(false)
  const [remember, setRemember] = useState(false) // Tracks whether the “remember me” checkbox is checked
  const navigate = useNavigate() // React Router hook for navigation
  const { checkAuth } = useContext(AuthContext)
  const params = useParams()



  //register function
  const handleRegister = async () => {
    // console.log("register clicked")
    // console.log(email , password)
    if (!name || !email || !password) {
      toast.info("Please fill all the fields")
      return
    }
    else {
      const result = await registerApi({ name, email, password })
      // console.log("register result", result)
      if (result.status >= 200 && result.status < 300) {
        setName("")
        setEmail("")
        setPassword("")
        toast.success("Registration successful! Please login.")
        setTimeout(() => {
          navigate("/login")
        }, 3005)
      }

      else if (result.status >= 400 && result.status < 500) {
        toast.warning(result.response.data.message)
        setName("")
        setEmail("")
        setPassword("")
      }
      else {
        toast.error("Registration failed. Please try again.")
        setName("")
        setEmail("")
        setPassword("")
      }
    }


  }

  //login function
  const handleLogin = async () => {
    console.log("login clicked")
    if (!email || !password) {
      toast.info("Please fill all the fields")
      return
    }
    else {
      const result = await loginApi({ email, password, remember })
      // console.log(result);
      if (result.status === 200) {
        toast.success("Login successful!")
        checkAuth()
        if (result.data.user.email == "greengoldspices.ndkm@gmail.com") {
          setTimeout(() => {
            navigate("/admin/dashboard")
          }, 5005)
        }
        else {
          setTimeout(() => {
            navigate("/")
          }, 5005)
        }

      }
      else if (result.status >= 400 && result.status < 500) {
        toast.error(result.response.data.message)

      }
      else {
        toast.error("Login failed. Please try again.")
      }
    }
  }

  //google login function
  const handleLoginSuccess = async (credentialResponse) => {
    //console.log("Login Success:", credentialResponse);

    // Decode the JWT token to see user details
    const decodedUser = jwtDecode(credentialResponse.credential);
    // console.log(decodedUser);
    const reqBody = { "name": decodedUser.name, "email": decodedUser.email, "password": "googlepswd", remember }

    const result = await googleLoginApi(reqBody)
     console.log(result);
    if (result.status === 200) {
      checkAuth()
      toast.success("Login successful!")
      if (result.data.user.name == "Shivapriya" || result.data.user.email ==='greengoldspices.ndkm@gmail.com') {
        setTimeout(() => {
          navigate("/admin/dashboard")
        }, 5005)
      }
      else {
        setTimeout(() => {
          navigate("/")
        }, 5005)
      }

    }
    else if (result.status >= 400 && result.status < 500) {
      toast.error(result.response.data.message)

    }
    else {
      toast.error("Login failed. Please try again.")
    }

  };

  //forgot password function
  const handleforgotPassword = async () => {
    if (!email) {
      toast.info('Please enter Email')
    }
    else {
      toast.info('Please check the email')
      const result = await forgotPasswordApi({ email })
      // console.log(result);


    }
  }

  //RESET PASSWORD
  const handleResetPassword = async () => {
    const { token } = params
    console.log(token, password, confirmPassword, email);

    if (!token || !password || !confirmPassword || !email) {
      toast.info('Please fill all fields')
    }
    else {
      if (password != confirmPassword) {
        toast.warning('new password and Confirm password must match')
      }
      else {

        const result = await resetPasswordApi({ email, password: confirmPassword }, token)
        console.log(result);
        if (result.status >= 200 && result.status < 300) {
          toast.success(result.data.message)
          setTimeout(() => {
            navigate('/login')
          }, 3002)
          setName("")
          setPassword("")
          setEmail("")
          setConfirmPassword("")
        }
        else {
          toast.error('Something went wrong . please try after sometime')
        }

      }
    }


  }


  return (
    <div className="page-wrap">
     



      <div className="video-overlay" />

      <div className="login-page">
        <div className="left-panel">
          <div className="left-overlay md:ml-40">
            <div className="brand">
              <img src="/assets/leaf.png" alt="Green Gold" className="brand-logo" />
              <h1 className="brand-title">GREEN GOLD</h1>
              <div className="brand-sub">SPICES</div>
              {/* <div className="promo">
                <div className="promo-line">
                 FROM THE MISTY HILLS
                </div>
                <h4>Comes an  <br /> Extraordinary <br /> Aroma</h4>
                <div className="promo-hr"> </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="card" style={{backgroundColor:'transparent'}}>
            <div className="card-head ">
              <div className="welcome">WELCOME BACK</div>
              {!register ? <h3 className="title">Login to your account</h3> : forgetPassword ? <h3 className="title">Reset Paasword</h3> : <h3 className="title">Create your account</h3>}
              <img src="/assets/leaf.png" alt="Green Gold" className="brand-logo small" />
            </div>

            <form className="login-form">
              {register &&
                <>
                  <label className="field-label">NAME</label>
                  <div className="input-group">
                    <span className="icon"><FontAwesomeIcon icon={faUser} /></span>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </>
              }

              <label className="field-label">EMAIL ADDRESS</label>
              <div className="input-group">
                <span className="icon"><FontAwesomeIcon icon={faUser} /></span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* {reset_password && <div>
                <label className="field-label">NEW PASSWORD</label>
                <div className="input-group">
                <span className="icon"><FontAwesomeIcon icon={faLock} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="toggle password"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              <label className="field-label">CONFORM PASSWORD</label>
              <div className="input-group">
                <span className="icon"><FontAwesomeIcon icon={faLock} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="toggle password"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              </div>} */}

              {!forgetPassword && <label className="field-label">{reset_password ? 'NEW PASSWORD' : 'PASSWORD'}</label>}
              {!forgetPassword && <div className="input-group">
                <span className="icon"><FontAwesomeIcon icon={faLock} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="toggle password"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>

              </div>}
              {reset_password && <p style={{ color: 'red', fontSize: '10px' }}>*The password must be 8 characters</p>}
              {reset_password && <label className="field-label">CONFIRM PASSWORD</label>}
              {reset_password && <div className="input-group">
                <span className="icon"><FontAwesomeIcon icon={faLock} /></span>
                <input
                  type={showPswd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShowPswd((s) => !s)}
                  aria-label="toggle password"
                >
                  <FontAwesomeIcon icon={showPswd ? faEyeSlash : faEye} />
                </button>
              </div>}


              {(!register && !forgetPassword && !reset_password) && <div className="form-row choices">
                <label className="remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <div className="forgot"><Link style={{ color: '#6b8b2a', textDecoration: 'none' }} to={'/forgot_password'}>Forgot password?</Link></div>
              </div>}

              {register ? <button className="btn primary" type="button" onClick={handleRegister}>REGISTER <span className="arrow"><FontAwesomeIcon icon={faArrowRight} /></span></button> : forgetPassword ? <button className="btn primary" type="button" onClick={handleforgotPassword}>RESET PASSWORD <span className="arrow"><FontAwesomeIcon icon={faArrowRight} /></span></button> : reset_password ? <button className="btn primary" type="button" onClick={handleResetPassword}>UPDATE PASSWORD <span className="arrow"><FontAwesomeIcon icon={faArrowRight} /></span></button> : <button className="btn primary" type="button" onClick={handleLogin}>LOGIN <span className="arrow"><FontAwesomeIcon icon={faArrowRight} /></span></button>
              }



              {!register && <div className="divider">OR</div>}

              {!register && (
                // <button className="btn ghost" type="button"><FontAwesomeIcon icon={faUser} /> LOGIN WITH GOOGLE</button>
                <GoogleLogin className="google" width={'500px'}
                  onSuccess={credentialResponse => {
                    console.log(credentialResponse);
                    handleLoginSuccess(credentialResponse)
                  }}
                  onError={() => {
                    console.log('Login Failed');

                  }}
                />
              )}

              {!register ? (
                <div className="register">Don't have an account? <Link to={"/register"}>Register →</Link></div>
              ) : (
                <div className="register">Already have an account? <Link to={"/login"}>Login →</Link></div>
              )}
            </form>
          </div>
        </div>
      </div>

      <Footer login />

      <ToastContainer
        position='top-right'
        autoClose={3000}
        theme='colored' />
    </div>
  )
}
