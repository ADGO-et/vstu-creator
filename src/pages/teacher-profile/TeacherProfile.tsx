import { useGetTeacherProfile } from "@/services/teacher"
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Globe, GraduationCap, Clock } from "lucide-react"
import { useState } from "react"

const formatFullName = (t: any) => [t?.firstName, t?.lastName].filter(Boolean).join(" ") || "Unnamed"

const formatDate = (d?: string) => {
  if (!d) return "—"
  try {
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  } catch {
    return d
  }
}

const Skeleton = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-64" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    </div>
  </div>
)

const TeacherProfile = () => {
  const { data: teacherProfile, isLoading, error } = useGetTeacherProfile()
  const [copied, setCopied] = useState(false)

  if (process.env.NODE_ENV === "development") console.debug("teacher profile", teacherProfile)

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="text-red-600 font-medium">Error loading teacher profile</div>
          <div className="text-red-500 text-sm mt-1">Please try refreshing the page</div>
        </div>
      </div>
    )
  }

  const t = teacherProfile

  const copyReferral = (code?: string) => {
    if (!code) return
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && <Skeleton />}

        {!isLoading && t && (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary/50 to-white h-24"></div>
              <div className="px-6 sm:px-8 pb-8">
                <div className="flex flex-col lg:flex-row gap-6 -mt-12">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-indigo-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white">
                      {formatFullName(t)
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    {t.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{formatFullName(t)}</h1>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <User className="w-4 h-4 mr-1" />
                            {t.role?.toUpperCase() || "TEACHER"}
                          </span>
                          {!t.isVerified && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                              <Clock className="w-4 h-4 mr-1" />
                              Pending Verification
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{t.email || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>+{t.phoneNumber || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Joined {formatDate(t.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{t.teachingExperience ?? 0}</p>
                    <p className="text-sm text-gray-500">Years Experience</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {(t.teachingExperience ?? 0) > 5 ? "Senior Educator" : "Growing Professional"}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{t.subject?.length || 0}</p>
                    <p className="text-sm text-gray-500">Subjects</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Active specializations</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{t.languagesSpoken?.length || 0}</p>
                    <p className="text-sm text-gray-500">Languages</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Communication reach</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{t.grades?.length || 0}</p>
                    <p className="text-sm text-gray-500">Grade Levels</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Teaching assignments</p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Subjects */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Subjects</h3>
                </div>
                <div className="space-y-3">
                  {t.subject?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {t.subject.map((s: any) => (
                        <span
                          key={s._id}
                          className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No subjects assigned</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Globe className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
                </div>
                <div className="space-y-3">
                  {t.languagesSpoken?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {t.languagesSpoken.map((l: any) => (
                        <span
                          key={l._id}
                          className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium bg-green-50 text-green-700 border border-green-100"
                        >
                          {l.language}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No languages listed</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Grades Section */}
            {t.grades?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Grade Assignments</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {t.grades.map((g: any) => (
                    <div
                      key={g._id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-purple-200 hover:bg-purple-50/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">Grade {g.grade}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {g.subjects?.length || 0} subjects
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Active teaching assignment</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address & Metadata */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
              {/* Address */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm bg-gradient-to-r from-primary/10 to-primary/30">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm font-medium text-gray-600">Region</span>
                    <span className="text-sm text-gray-900">{t.address?.region || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm font-medium text-gray-600">Zone</span>
                    <span className="text-sm text-gray-900">{t.address?.zone || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">Woreda</span>
                    <span className="text-sm text-gray-900">{t.address?.woreda || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm bg-gradient-to-r from-blue-50 to-blue-200">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Profile Details</h3>
                </div>
                <div className="space-y-3">
                  {/* Referral Code (teacher_id) with copy */}
                  <div className="py-2 border-b border-gray-100">
                    <span className="block text-xs font-medium text-gray-500 tracking-wide mb-1">REFERRAL CODE</span>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-900 font-mono">
                        {t.teacher_id || "—"}
                      </span>
                      {t.teacher_id && (
                        <button
                          onClick={() => copyReferral(t.teacher_id)}
                          className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                            copied
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                          }`}
                          aria-label="Copy referral code"
                        >
                          {copied ? "Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Verified status */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Verified</span>
                    <span className={`text-sm font-medium ${t.isVerified ? "text-green-600" : "text-amber-600"}`}>
                      {t.isVerified ? "Yes" : "Pending"}
                    </span>
                  </div>
                  {/* Explanatory note */}
                  <p className="pt-1 text-xs text-gray-600 leading-relaxed">
                    If your account is not verified, your referral code will be inactive. To verify your account,
                    please contact VSTU Customer Support or an administrator.
                  </p>
                  {/* Remaining metadata */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Age</span>
                    <span className="text-sm text-gray-900">{t.age ?? "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Gender</span>
                    <span className="text-sm text-gray-900 capitalize">{t.gender || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">Last Updated</span>
                    <span className="text-sm text-gray-900">{formatDate(t.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !t && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Data</h3>
            <p className="text-gray-500">No teacher profile information is available at this time.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherProfile
