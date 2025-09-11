import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

interface RegistrationClosedProps {
  message: string
}

export default function RegistrationClosed({ message }: RegistrationClosedProps) {
  return (
    <div className="relative z-10 w-full p-4 md:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-yellow-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Pendaftaran Ditutup</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-white/80 leading-relaxed">{message}</p>
        </CardContent>
      </Card>
    </div>
  )
}
