interface VerifiedBadgeProps {
  isVerified: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function VerifiedBadge({ isVerified, size = "md", className = "" }: VerifiedBadgeProps) {
  if (!isVerified) return null

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <img
      src="/blue-verified-badge.svg"
      alt="Verified"
      className={`${sizeClasses[size]} ${className}`}
      style={{ display: "inline-block" }}
    />
  )
}
