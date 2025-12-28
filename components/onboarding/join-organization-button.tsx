'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Users, Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const JoinOrganizationButton = () => {
  const [inviteCode, setInviteCode] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      toast.error('Veuillez entrer un code d\'invitation')
      return
    }

    if (inviteCode.length !== 8) {
      toast.error('Le code d\'invitation doit contenir 8 caractères')
      return
    }

    setIsLoading(true)

    try {
      // Simuler une validation du code
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Rediriger vers la page d'invitation
      window.location.href = `/invite/${inviteCode.trim()}`
    } catch (error) {
      console.error('Error joining organization', error)
      toast.error('Erreur lors de la validation du code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          <Users className="h-4 w-4 mr-2" />
          Rejoindre une organisation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rejoindre une organisation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Code d&apos;invitation
            </label>
            <div className="flex justify-center pt-2">
              <InputOTP
                maxLength={8}
                value={inviteCode}
                onChange={setInviteCode}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Entrez le code à 8 caractères reçu par email
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleJoin}
              disabled={inviteCode.length !== 8 || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Validation...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Rejoindre
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default JoinOrganizationButton
