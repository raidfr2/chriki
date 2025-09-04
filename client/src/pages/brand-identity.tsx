import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Palette, Type, Image, Share2 } from "lucide-react";
import html2canvas from "html2canvas";

export default function BrandIdentity() {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadElement = async (elementId: string, filename: string) => {
    setIsGenerating(true);
    try {
      const element = document.getElementById(elementId);
      if (!element) return;

      // Get element dimensions
      const rect = element.getBoundingClientRect();
      
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: rect.width,
        height: rect.height,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
      });

      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-mono text-4xl font-bold text-foreground mb-4 tracking-tight">
            CHRIKI Brand Identity
          </h1>
          <p className="text-lg text-muted-foreground">
            Download brand assets as PNG files for your marketing needs
          </p>
        </div>

        {/* Brand Elements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Logo Card */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                id="logo-element" 
                className="bg-background border-2 border-foreground p-8 rounded-lg text-center"
              >
                <div className="font-mono font-bold text-6xl tracking-tight text-foreground mb-2">
                  CHRIKI
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Your Algerian AI Assistant
                </div>
              </div>
              <Button 
                onClick={() => downloadElement("logo-element", "chriki-logo")}
                disabled={isGenerating}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Logo
              </Button>
            </CardContent>
          </Card>

          {/* Social Media Profile Picture */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Social Media PFP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                id="social-pfp-element" 
                className="bg-background border-2 border-foreground p-8 rounded-full aspect-square flex items-center justify-center mx-auto w-48 h-48"
              >
                <div className="text-foreground text-center">
                  <div className="font-mono font-bold text-2xl tracking-tight">CHRIKI</div>
                </div>
              </div>
              <Button 
                onClick={() => downloadElement("social-pfp-element", "chriki-social-pfp")}
                disabled={isGenerating}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PFP
              </Button>
            </CardContent>
          </Card>

          {/* Brand Colors */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Brand Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div id="colors-element" className="bg-background border-2 border-foreground p-6 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-full h-16 bg-foreground rounded-lg mb-2"></div>
                    <div className="text-xs font-medium text-foreground">Foreground</div>
                    <div className="text-xs text-muted-foreground">Primary Text</div>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-16 bg-background border border-border rounded-lg mb-2"></div>
                    <div className="text-xs font-medium text-foreground">Background</div>
                    <div className="text-xs text-muted-foreground">Main Background</div>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-16 bg-muted rounded-lg mb-2"></div>
                    <div className="text-xs font-medium text-foreground">Muted</div>
                    <div className="text-xs text-muted-foreground">Secondary Background</div>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-16 bg-border rounded-lg mb-2"></div>
                    <div className="text-xs font-medium text-foreground">Border</div>
                    <div className="text-xs text-muted-foreground">UI Borders</div>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => downloadElement("colors-element", "chriki-brand-colors")}
                disabled={isGenerating}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Colors
              </Button>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Typography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div id="typography-element" className="bg-background border-2 border-foreground p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <div className="font-mono text-3xl font-bold text-foreground tracking-tight mb-1">CHRIKI</div>
                    <div className="text-xs text-muted-foreground">Primary Font - Bold</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-foreground mb-1">Your Algerian AI Assistant</div>
                    <div className="text-xs text-muted-foreground">Secondary Font - Semibold</div>
                  </div>
                  <div>
                    <div className="text-base text-foreground mb-1">Chat naturally in Darija about daily life</div>
                    <div className="text-xs text-muted-foreground">Body Text - Regular</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Supporting text and descriptions</div>
                    <div className="text-xs text-muted-foreground">Small Text - Regular</div>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => downloadElement("typography-element", "chriki-typography")}
                disabled={isGenerating}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Typography
              </Button>
            </CardContent>
          </Card>

          {/* Logo Variations */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Logo Variations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div id="logo-variations-element" className="bg-background border-2 border-foreground p-6 rounded-lg">
                <div className="space-y-6">
                  {/* Light Version */}
                  <div className="text-center">
                    <div className="bg-background border border-border p-4 rounded-lg">
                      <div className="font-mono font-bold text-3xl tracking-tight text-foreground">CHRIKI</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Light Background</div>
                  </div>
                  
                  {/* Dark Version */}
                  <div className="text-center">
                    <div className="bg-foreground p-4 rounded-lg">
                      <div className="font-mono font-bold text-3xl tracking-tight text-background">CHRIKI</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Dark Background</div>
                  </div>
                  
                  {/* Minimal Version */}
                  <div className="text-center">
                    <div className="p-4">
                      <div className="font-mono font-bold text-2xl tracking-tight text-foreground bg-background border-2 border-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                        C
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Icon Version</div>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => downloadElement("logo-variations-element", "chriki-logo-variations")}
                disabled={isGenerating}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Variations
              </Button>
            </CardContent>
          </Card>

          {/* Social Media Banner */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Social Media Banner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                id="social-banner-element" 
                className="bg-background border-2 border-foreground p-8 rounded-lg text-foreground aspect-[3/1] flex items-center justify-between"
              >
                <div>
                  <div className="font-mono font-bold text-4xl tracking-tight mb-2">CHRIKI</div>
                  <div className="text-lg text-foreground">Your Algerian AI Assistant</div>
                  <div className="text-sm text-muted-foreground mt-1">Chat naturally in Darija</div>
                </div>
                <div className="font-mono font-bold text-6xl text-muted-foreground">
                  C
                </div>
              </div>
              <Button 
                onClick={() => downloadElement("social-banner-element", "chriki-social-banner")}
                disabled={isGenerating}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Banner
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Brand Guidelines */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Brand Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-mono font-bold text-foreground mb-2">Brand Voice</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Authentic and conversational</li>
                  <li>• Culturally aware</li>
                  <li>• Helpful and friendly</li>
                  <li>• Respectful of local customs</li>
                </ul>
              </div>
              <div>
                <h3 className="font-mono font-bold text-foreground mb-2">Color Usage</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Foreground - Primary text and borders</li>
                  <li>• Background - Main canvas color</li>
                  <li>• Muted - Secondary backgrounds</li>
                  <li>• Border - UI element borders</li>
                </ul>
              </div>
              <div>
                <h3 className="font-mono font-bold text-foreground mb-2">Typography</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Headings: Bold, uppercase for impact</li>
                  <li>• Body: Clean, readable sans-serif</li>
                  <li>• Consistent spacing and hierarchy</li>
                  <li>• Support for Arabic/French text</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download All Button */}
        <div className="text-center mt-8">
          <Button 
            onClick={async () => {
              await downloadElement("logo-element", "chriki-logo");
              await downloadElement("social-pfp-element", "chriki-social-pfp");
              await downloadElement("colors-element", "chriki-brand-colors");
              await downloadElement("typography-element", "chriki-typography");
              await downloadElement("logo-variations-element", "chriki-logo-variations");
              await downloadElement("social-banner-element", "chriki-social-banner");
            }}
            disabled={isGenerating}
            size="lg"
            className="px-8"
          >
            <Download className="w-5 h-5 mr-2" />
            {isGenerating ? "Generating..." : "Download All Assets"}
          </Button>
        </div>
      </div>
    </div>
  );
}
