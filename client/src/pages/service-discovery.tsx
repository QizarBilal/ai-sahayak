import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Navigation, Phone, Loader2, Volume2, AlertCircle, StopCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import staticServicesData from "@/data/staticServices.json";

const serviceTypes = [
  { value: "hospital", label: "Hospital / Clinic", labelHi: "अस्पताल / क्लिनिक", labelTa: "மருத்துவமனை / கிளினிக்" },
  { value: "police", label: "Police Station", labelHi: "पुलिस स्टेशन", labelTa: "காவல் நிலையம்" },
  { value: "post_office", label: "Post Office", labelHi: "डाकघर", labelTa: "தபால் அலுவலகம்" },
  { value: "bank", label: "Bank / ATM", labelHi: "बैंक / एटीएम", labelTa: "வங்கி / ATM" },
  { value: "government_office", label: "Government Office", labelHi: "सरकारी कार्यालय", labelTa: "அரசு அலுவலகம்" },
  { value: "school", label: "School / College", labelHi: "स्कूल / कॉलेज", labelTa: "பள்ளி / கல்லூரி" },
  { value: "railway_station", label: "Railway Station", labelHi: "रेलवे स्टेशन", labelTa: "ரயில் நிலையம்" },
  { value: "bus_station", label: "Bus Station", labelHi: "बस स्टेशन", labelTa: "பேருந்து நிலையம்" },
  { value: "petrol_pump", label: "Petrol Pump", labelHi: "पेट्रोल पंप", labelTa: "பெட்ரோல் பம்ப்" },
];

interface NearbyService {
  id?: string;
  name: string;
  type: string;
  address: string;
  distance: number;
  latitude: number;
  longitude: number;
  phone?: string;
  contact?: string;
}

// Map service types to JSON keys
const SERVICE_TYPE_MAP: Record<string, string> = {
  hospital: "hospitals",
  police: "police",
  post_office: "post_offices",
  bank: "banks",
  government_office: "government_offices",
  school: "schools",
  railway_station: "railway_stations",
  bus_station: "bus_stations",
  petrol_pump: "petrol_pumps",
};

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Smart static matching function
function getStaticServices(
  serviceType: string,
  location: string,
  coords?: { lat: number; lon: number }
): NearbyService[] {
  const jsonKey = SERVICE_TYPE_MAP[serviceType];
  if (!jsonKey || !(staticServicesData as any)[jsonKey]) {
    return [];
  }

  const allServices = (staticServicesData as any)[jsonKey] as any[];
  
  // If coords provided, calculate actual distance and sort
  if (coords) {
    return allServices
      .map((service: any) => ({
        ...service,
        phone: service.contact || service.phone,
        distance: calculateDistance(
          coords.lat,
          coords.lon,
          service.latitude,
          service.longitude
        ),
      }))
      .sort((a: any, b: any) => a.distance - b.distance)
      .slice(0, 10); // Return top 10 nearest
  }

  // Text-based search in name/address
  const searchTerm = location.toLowerCase();
  let filtered = allServices;

  if (searchTerm) {
    filtered = allServices.filter((service: any) => {
      const nameMatch = service.name.toLowerCase().includes(searchTerm);
      const addressMatch = service.address.toLowerCase().includes(searchTerm);
      return nameMatch || addressMatch;
    });
  }

  // Add estimated distances
  return filtered.slice(0, 10).map((service: any, index: number) => ({
    ...service,
    phone: service.contact || service.phone,
    distance: 1.0 + index * 0.8, // Estimated distances
  }));
}

export default function ServiceDiscovery() {
  const [serviceType, setServiceType] = useState("");
  const [location, setLocation] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [results, setResults] = useState<NearbyService[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { t, i18n } = useTranslation();

  const searchMutation = useMutation({
    mutationFn: async (data: { serviceType: string; location: string; coords?: { lat: number; lon: number } }) => {
      return apiRequest("POST", "/api/services/search", data);
    },
    onSuccess: (data: any) => {
      setResults(data.services || []);
      setUseFallbackMode(false);
      toast({
        title: t('services.searchComplete'),
        description: t('services.foundServices'),
      });
    },
    onError: (error: any, variables: any) => {
      // Static fallback with smart matching
      setUseFallbackMode(true);
      const fallbackServices = getStaticServices(
        variables.serviceType,
        variables.location,
        variables.coords
      );
      setResults(fallbackServices);
      toast({
        title: t('services.fallbackMode') || "API not working — showing static nearby services",
        description: `${t('services.staticServices') || "Found"} ${fallbackServices.length} ${t('services.services') || "services"}`,
        variant: "default",
      });
    },
  });

  const handleSearch = () => {
    if (useCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          searchMutation.mutate({
            serviceType,
            location: "Current Location",
            coords: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
          });
        },
        (error) => {
          toast({
            title: t('services.locationError') || "Location Error",
            description: t('services.locationErrorDesc') || "Could not access GPS. Please enter location manually.",
            variant: "destructive",
          });
          // Fallback to static services with estimated location
          setUseFallbackMode(true);
          const fallbackServices = getStaticServices(serviceType, location || "");
          setResults(fallbackServices);
        }
      );
    } else {
      searchMutation.mutate({ serviceType, location });
    }
  };

  const openInMaps = (lat: number, lon: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, "_blank");
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Map language to correct voice code
      const langMap: { [key: string]: string } = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'ta': 'ta-IN',
        'te': 'te-IN',
        'bn': 'bn-IN',
        'mr': 'mr-IN',
        'gu': 'gu-IN',
        'kn': 'kn-IN',
        'ml': 'ml-IN',
        'pa': 'pa-IN'
      };
      
      utterance.lang = langMap[i18n.language] || 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3">{t('services.title')}</h1>
            <p className="text-lg text-muted-foreground">
              {t('services.subtitle')}
            </p>
            {useFallbackMode && (
              <Badge variant="outline" className="mt-3 text-sm">
                <AlertCircle className="h-3 w-3 mr-1" />
                {t('services.fallbackMode') || "API not working — showing nearby static services"}
              </Badge>
            )}
          </div>
          {isSpeaking && (
            <Button variant="destructive" size="sm" onClick={stopSpeaking}>
              <StopCircle className="mr-2 h-4 w-4" />
              {t('services.stopSpeaking') || "Stop"}
            </Button>
          )}
        </div>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{t('services.searchNearby')}</CardTitle>
          <CardDescription className="text-base">
            {t('services.findNearby')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="serviceType" className="text-base">{t('services.serviceType')}</Label>
            <Select value={serviceType} onValueChange={setServiceType} required>
              <SelectTrigger id="serviceType" className="h-12 text-base">
                <SelectValue placeholder={t('services.selectServiceType')} />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {i18n.language === 'hi' && type.labelHi ? type.labelHi : 
                     i18n.language === 'ta' && type.labelTa ? type.labelTa : 
                     type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-base">{t('services.location')}</Label>
            <div className="flex gap-3">
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('services.enterLocation')}
                disabled={useCurrentLocation}
                className="flex-1 h-12 text-base"
              />
              <Button
                variant={useCurrentLocation ? "default" : "outline"}
                onClick={() => setUseCurrentLocation(!useCurrentLocation)}
              >
                <Navigation className="mr-2 h-5 w-5" />
                {useCurrentLocation ? t('services.usingGPS') : t('services.useGPS')}
              </Button>
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={!serviceType || (!location && !useCurrentLocation) || searchMutation.isPending}
            size="lg"
            className="w-full h-14 text-lg"
          >
            {searchMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t('services.searching')}
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-5 w-5" />
                {t('services.searchServices')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {t('services.found')} {results.length} {serviceTypes.find(type => type.value === serviceType)?.label || t('services.services')}
          </h2>
          <div className="space-y-4">
            {results.map((service, idx) => (
              <Card key={idx} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2">
                        {service.name}
                      </h3>
                      <p className="text-base text-muted-foreground mb-2">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        {service.address}
                      </p>
                      {service.phone && (
                        <p className="text-base text-muted-foreground">
                          <Phone className="inline h-4 w-4 mr-1" />
                          {service.phone}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-base px-4 py-2 shrink-0">
                      {service.distance.toFixed(1)} km
                    </Badge>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <Button
                      variant="default"
                      onClick={() => openInMaps(service.latitude, service.longitude)}
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      {t('services.getDirections')}
                    </Button>
                    {service.phone && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(`tel:${service.phone}`, "_self")}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        {t('services.call')}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        const text = `${service.name}, ${t('services.locatedAt')} ${service.address}. ${t('services.distance')}: ${service.distance.toFixed(1)} ${t('services.kilometersAway')}. ${
                          service.phone ? `${t('services.phoneNumber')}: ${service.phone}` : ""
                        }`;
                        speakText(text);
                      }}
                      disabled={isSpeaking}
                    >
                      <Volume2 className="mr-2 h-4 w-4" />
                      {t('services.speak')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
