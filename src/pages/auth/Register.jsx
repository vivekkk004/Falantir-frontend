import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearError } from '../../app/features/authSlice'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [validationError, setValidationError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) dispatch(clearError())
    if (validationError) setValidationError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }
    const { confirmPassword, ...submitData } = formData
    const result = await dispatch(registerUser(submitData))
    if (registerUser.fulfilled.match(result)) {
      toast.success(`Welcome aboard, ${result.payload.user?.name}!`)
      navigate('/dashboard')
    }
  }

  const displayError = error || validationError

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-dark-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-glow">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Falantir</span>
          </div>
        </div>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white leading-tight"
          >
            Start protecting<br />your business<br />
            <span className="text-gradient">today.</span>
          </motion.h2>
          <p className="text-slate-500 text-sm mt-4 max-w-xs">
            Set up your Falantir account and connect your cameras to get autonomous AI security monitoring.
          </p>
        </div>

        <p className="relative z-10 text-xs text-slate-600">v2.0 — Final Year AI Project</p>
      </div>

      {/* Right — Register Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-surface-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden text-center mb-10">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-glow">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Falantir</h1>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Create account</h1>
            <p className="text-slate-400 text-sm mt-1">Get started with Falantir security</p>
          </div>

          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              {displayError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" id="register-name" name="name" type="text" placeholder="John Doe" icon={User} value={formData.name} onChange={handleChange} required />
            <Input label="Email" id="register-email" name="email" type="email" placeholder="you@example.com" icon={Mail} value={formData.email} onChange={handleChange} required />
            <div className="relative">
              <Input label="Password" id="register-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" icon={Lock} value={formData.password} onChange={handleChange} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[30px] text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Input label="Confirm Password" id="register-confirm" name="confirmPassword" type="password" placeholder="Re-enter password" icon={Lock} value={formData.confirmPassword} onChange={handleChange} required />

            <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="lg">
              Create Account <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
