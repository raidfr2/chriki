import React, { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useLocation } from 'wouter'
import { Loader2, User, MapPin } from 'lucide-react'

// Algerian wilayas with their official numbering
const WILAYAS = [
  { code: '01', name: 'Adrar' },
  { code: '02', name: 'Chlef' },
  { code: '03', name: 'Laghouat' },
  { code: '04', name: 'Oum El Bouaghi' },
  { code: '05', name: 'Batna' },
  { code: '06', name: 'Béjaïa' },
  { code: '07', name: 'Biskra' },
  { code: '08', name: 'Béchar' },
  { code: '09', name: 'Blida' },
  { code: '10', name: 'Bouira' },
  { code: '11', name: 'Tamanrasset' },
  { code: '12', name: 'Tébessa' },
  { code: '13', name: 'Tlemcen' },
  { code: '14', name: 'Tiaret' },
  { code: '15', name: 'Tizi Ouzou' },
  { code: '16', name: 'Alger' },
  { code: '17', name: 'Djelfa' },
  { code: '18', name: 'Jijel' },
  { code: '19', name: 'Sétif' },
  { code: '20', name: 'Saïda' },
  { code: '21', name: 'Skikda' },
  { code: '22', name: 'Sidi Bel Abbès' },
  { code: '23', name: 'Annaba' },
  { code: '24', name: 'Guelma' },
  { code: '25', name: 'Constantine' },
  { code: '26', name: 'Médéa' },
  { code: '27', name: 'Mostaganem' },
  { code: '28', name: 'MSila' },
  { code: '29', name: 'Mascara' },
  { code: '30', name: 'Ouargla' },
  { code: '31', name: 'Oran' },
  { code: '32', name: 'El Bayadh' },
  { code: '33', name: 'Illizi' },
  { code: '34', name: 'Bordj Bou Arréridj' },
  { code: '35', name: 'Boumerdès' },
  { code: '36', name: 'El Tarf' },
  { code: '37', name: 'Tindouf' },
  { code: '38', name: 'Tissemsilt' },
  { code: '39', name: 'El Oued' },
  { code: '40', name: 'Khenchela' },
  { code: '41', name: 'Souk Ahras' },
  { code: '42', name: 'Tipaza' },
  { code: '43', name: 'Mila' },
  { code: '44', name: 'Aïn Defla' },
  { code: '45', name: 'Naâma' },
  { code: '46', name: 'Aïn Témouchent' },
  { code: '47', name: 'Ghardaïa' },
  { code: '48', name: 'Relizane' }
]

interface OnboardingFormData {
  full_name: string
  username: string
  city: string
  wilaya: string
}

export default function Onboarding() {
  const { updateProfile, user } = useAuth()
  const { toast } = useToast()
  const [, setLocation] = useLocation()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingFormData>({
    full_name: '',
    username: '',
    city: '',
    wilaya: ''
  })

  const handleInputChange = (field: keyof OnboardingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.full_name.trim()) {
        toast({
          title: "Name required",
          description: "Please enter your full name to continue.",
          variant: "destructive"
        })
        return
      }
      if (!formData.username.trim()) {
        toast({
          title: "Username required", 
          description: "Please choose a username to continue.",
          variant: "destructive"
        })
        return
      }
    }
    setCurrentStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.full_name.trim() || !formData.username.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const { error } = await updateProfile({
        full_name: formData.full_name.trim(),
        username: formData.username.trim(),
        ...(formData.city.trim() && { city: formData.city.trim() }),
        ...(formData.wilaya && { wilaya: formData.wilaya }),
      })

      if (error) {
        toast({
          title: "Profile update failed",
          description: error.message,
          variant: "destructive"
        })
        return
      }

      toast({
        title: "Welcome to Chriki! 🎉",
        description: "Your profile has been set up successfully.",
      })

      // Mark onboarding as completed in localStorage to prevent redirect loop
      localStorage.setItem('chriki-onboarding-completed', 'true')
      
      // Redirect to chat page after successful onboarding
      setLocation('/chat')
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in-up">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="font-mono font-bold text-3xl tracking-tight">CHRIKI</div>
            <div className="w-2 h-2 bg-foreground rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome to Chriki!</h1>
          <p className="text-muted-foreground text-sm">
            Let's set up your profile to get started
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2 animate-fade-in">
          <div className={`w-2 h-2 rounded-full transition-colors ${
            currentStep >= 1 ? 'bg-primary' : 'bg-muted'
          }`} />
          <div className={`w-2 h-2 rounded-full transition-colors ${
            currentStep >= 2 ? 'bg-primary' : 'bg-muted'
          }`} />
        </div>

        {/* Form Card */}
        <Card className="animate-fade-in-scale border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg flex items-center justify-center gap-2">
              {currentStep === 1 ? (
                <>
                  <User className="w-5 h-5" />
                  Personal Info
                </>
              ) : (
                <>
                  <MapPin className="w-5 h-5" />
                  Location (Optional)
                </>
              )}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 
                ? "Tell us a bit about yourself"
                : "Help us personalize your experience"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentStep === 1 ? (
                <div className="space-y-4 animate-slide-in-left">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="transition-all focus:scale-[1.02]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a unique username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="transition-all focus:scale-[1.02]"
                      required
                    />
                  </div>

                  <Button 
                    type="button"
                    onClick={handleNext}
                    className="w-full mt-6 transition-all hover:scale-[1.02]"
                  >
                    Next Step
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 animate-slide-in-left">
                  <div className="space-y-2">
                    <Label htmlFor="wilaya">Wilaya</Label>
                    <Select 
                      value={formData.wilaya} 
                      onValueChange={(value) => handleInputChange('wilaya', value)}
                    >
                      <SelectTrigger className="transition-all focus:scale-[1.02]">
                        <SelectValue placeholder="Select your wilaya" />
                      </SelectTrigger>
                      <SelectContent>
                        {WILAYAS.map((wilaya) => (
                          <SelectItem key={wilaya.code} value={wilaya.name}>
                            {wilaya.code} - {wilaya.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="transition-all focus:scale-[1.02]"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 transition-all hover:scale-[1.02]"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 transition-all hover:scale-[1.02]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Setting up...
                        </>
                      ) : (
                        'Complete Setup'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Skip option for step 2 */}
        {currentStep === 2 && (
          <div className="text-center animate-fade-in">
            <button
              onClick={handleSubmit}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
              disabled={loading}
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
