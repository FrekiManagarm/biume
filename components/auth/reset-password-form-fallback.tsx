import { Loader2 } from "lucide-react"

export const ResetPasswordFormFallback = () => {
  return (
    <div className="min-h-screen w-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-16 py-8">
          <div className="mx-auto w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Chargement du formulaire...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex lg:flex-1 bg-linear-to-br from-primary/10 to-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent" />
        </div>
      </div>
    </div>
  )
}

