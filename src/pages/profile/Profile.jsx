import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { User, Mail, Shield, Calendar, Edit2, Check, X } from 'lucide-react'
import { fetchCurrentUser, updateCurrentUser } from '../../app/features/userSlice'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Loader from '../../components/ui/Loader'
import toast from 'react-hot-toast'

const Profile = () => {
  const dispatch = useDispatch()
  const { profile, isLoading, updateLoading } = useSelector((state) => state.user)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name || '', email: profile.email || '' })
    }
  }, [profile])

  const handleSave = async () => {
    const result = await dispatch(updateCurrentUser(form))
    if (updateCurrentUser.fulfilled.match(result)) {
      toast.success('Profile updated!')
      setEditing(false)
    } else {
      toast.error(result.payload || 'Update failed')
    }
  }

  if (isLoading && !profile) {
    return <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>
  }

  const user = profile

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">View and update your account details</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-200">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
              <p className="text-slate-500 text-sm">{user?.email}</p>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mt-2 ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'}`}>
                <Shield className="w-3 h-3" />
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
              </span>
            </div>
          </div>

          {/* Fields */}
          {editing ? (
            <div className="space-y-4">
              <Input
                label="Full Name"
                id="profile-name"
                name="name"
                icon={User}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email Address"
                id="profile-email"
                name="email"
                type="email"
                icon={Mail}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} isLoading={updateLoading} size="sm">
                  <Check className="w-4 h-4" /> Save Changes
                </Button>
                <Button variant="ghost" onClick={() => setEditing(false)} size="sm">
                  <X className="w-4 h-4" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { label: 'Full Name', value: user?.name, icon: User },
                { label: 'Email Address', value: user?.email, icon: Mail },
                { label: 'Role', value: user?.role, icon: Shield },
                { label: 'Account Status', value: user?.is_active ? 'Active' : 'Inactive', icon: Check },
                { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—', icon: Calendar },
              ].map((field) => (
                <div key={field.label} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <field.icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{field.label}</p>
                    <p className="text-sm text-slate-800 font-semibold capitalize">{field.value || '—'}</p>
                  </div>
                </div>
              ))}
              <Button variant="secondary" onClick={() => setEditing(true)} size="sm" className="mt-2">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

export default Profile
