import { ShieldCheck } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-surface-200 py-4 px-6">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary-500" />
          <span>&copy; {new Date().getFullYear()} ShopGuard. All rights reserved.</span>
        </div>
        <p>AI-Powered Shoplifting Detection System</p>
      </div>
    </footer>
  )
}

export default Footer
