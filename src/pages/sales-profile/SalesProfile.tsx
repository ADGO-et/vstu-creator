import { useGetSalesProfile } from "@/services/sales"
import { Mail, MapPin, Calendar, Clock, Shield, ShieldCheck, User, Languages, Hash, Copy, Check } from "lucide-react"
import { useState } from "react"

const SalesProfile = () => {
  const { data, isLoading } = useGetSalesProfile()
  const [copied, setCopied] = useState(false)

  const profile = data ?? undefined

  const getInitials = (fn?: string, ln?: string) => ((fn?.[0] || "") + (ln?.[0] || "")).toUpperCase() || "U"

  const formatDate = (iso?: string) => {
    if (!iso) return "—"
    const d = new Date(iso)
    if (isNaN(d.getTime())) return "—"
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleCopyReferral = () => {
    if (!profile?.sales_id) return
    navigator.clipboard?.writeText(profile.sales_id).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="h-24 w-24 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-4">
                  <div className="h-8 w-64 bg-slate-200 rounded" />
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-slate-200 rounded-full" />
                    <div className="h-6 w-24 bg-slate-200 rounded-full" />
                  </div>
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                </div>
              </div>
            </div>

            {/* Cards skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="h-5 w-20 bg-slate-200 rounded mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 bg-slate-200 rounded" />
                    <div className="h-4 w-1/2 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <User className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Profile Found</h3>
          <p className="text-slate-500">No profile data is currently available.</p>
        </div>
      </div>
    )
  }

  const {
    firstName,
    lastName,
    role,
    email,
    age,
    phoneNumber,
    gender,
    address,
    languagesSpoken,
    isVerified,
    sales_id,
    createdAt,
    updatedAt,
  } = profile

  return (
    <div className="min-h-screen p-4 pb-12">
      <div className="mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-tertiary/60 flex items-center justify-center text-white text-2xl font-semibold shadow-lg ring-4 ring-blue-50">
                {getInitials(firstName, lastName)}
              </div>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 shadow-lg ring-2 ring-white">
                  <ShieldCheck className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {firstName} {lastName}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {role || "Sales Representative"}
                    </span>
                    {gender && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {gender}
                      </span>
                    )}
                    {age !== undefined && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {age} yrs
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                        isVerified
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {isVerified ? (
                        <>
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <Shield className="h-3 w-3 mr-1" />
                          Pending Verification
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-3">
                  {/* REPLACED: old small ID line with referral code block */}
                  <div className="w-full sm:w-auto">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Referral Code
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xl font-semibold tracking-wide text-slate-900">
                        {sales_id || "—"}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyReferral}
                        className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition px-2.5 py-1.5 text-xs font-medium"
                        aria-label="Copy referral code"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 max-w-xs">
                      If your account is not verified, your referral code will be inactive. To verify your account,
                      please contact VSTU Customer Support or an administrator.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow bg-gradient-to-br from-primary/30 to-tertiary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 block mb-1">Email</label>
                <p className="text-slate-900 break-all">{email || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 block mb-1">Phone</label>
                <p className="text-slate-900">{phoneNumber || "—"}</p>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Location</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 block mb-1">Region</label>
                <p className="text-slate-900">{address?.region || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 block mb-1">Zone</label>
                <p className="text-slate-900">{address?.zone || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 block mb-1">Woreda</label>
                <p className="text-slate-900">{address?.woreda || "—"}</p>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow bg-gradient-to-br from-primary/30 to-tertiary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Languages className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Languages</h2>
            </div>
            <div className="space-y-3">
              {languagesSpoken && languagesSpoken.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {languagesSpoken.map((l) => (
                    <span
                      key={l._id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {l.language}
                      {l.slug && <span className="ml-1 text-xs text-slate-500">({l.slug})</span>}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No languages specified</p>
              )}
            </div>
          </div>

          {/* Account Created */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Created</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 block mb-1">Date</label>
                <p className="text-slate-900">{formatDate(createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow bg-gradient-to-br from-primary/30 to-tertiary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Updated</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 block mb-1">Date</label>
                <p className="text-slate-900">{formatDate(updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Record ID */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Hash className="h-5 w-5 text-slate-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Record ID</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 block mb-1">Database ID</label>
                <p className="font-mono text-xs bg-slate-100 px-3 py-2 rounded-lg border text-slate-700 break-all">
                  {profile._id || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default SalesProfile
