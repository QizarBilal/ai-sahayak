import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { MapPin, Navigation, Phone, Loader2, ExternalLink } from "lucide-react";

const serviceTypes = [
  { value: "hospital", label: "Hospital / Clinic" },
  { value: "police", label: "Police Station" },
  { value: "post_office", label: "Post Office" },
  { value: "bank", label: "Bank / ATM" },
  { value: "government_office", label: "Government Office" },
  { value: "school", label: "School / College" },
  { value: "railway_station", label: "Railway Station" },
  { value: "bus_station", label: "Bus Station" },
];

interface NearbyService {
  name: string;
  type: string;
  address: string;
  distance: number;
  latitude: number;
  longitude: number;
  phone?: string;
}

export default function ServiceDiscovery() {
  const [serviceType, setServiceType] = useState("");
  const [location, setLocation] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const { toast } = useToast();

  const searchMutation = useMutation({
    mutationFn: async (data: { serviceType: string; location: string; coords?: { lat: number; lon: number } }) => {
      return apiRequest("POST", "/api/services/search", data);
    },
    onSuccess: () => {
      toast({
        title: "Search Complete",
        description: "Found nearby services",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not search for services. Please try again.",
        variant: "destructive",
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
        () => {
          toast({
            title: "Location Error",
            description: "Could not get your location. Please enter it manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      searchMutation.mutate({ serviceType, location });
    }
  };

  const results = (searchMutation.data as { services: NearbyService[] })?.services || [];

  const openInMaps = (lat: number, lon: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, "_blank");
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Service Discovery</h1>
        <p className="text-lg text-muted-foreground">
          Find nearby government offices and essential services
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Search Nearby Services</CardTitle>
          <CardDescription className="text-base">
            Find hospitals, police stations, banks, and more near you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="serviceType" className="text-base">Service Type</Label>
            <Select value={serviceType} onValueChange={setServiceType} required>
              <SelectTrigger id="serviceType" className="h-12 text-base" data-testid="select-service-type">
                <SelectValue placeholder="Select a service type" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-base">Location</Label>
            <div className="flex gap-3">
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city or area name"
                disabled={useCurrentLocation}
                className="flex-1 h-12 text-base"
                data-testid="input-location"
              />
              <Button
                variant={useCurrentLocation ? "default" : "outline"}
                onClick={() => setUseCurrentLocation(!useCurrentLocation)}
                data-testid="button-use-current-location"
              >
                <Navigation className="mr-2 h-5 w-5" />
                {useCurrentLocation ? "Using GPS" : "Use GPS"}
              </Button>
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={!serviceType || (!location && !useCurrentLocation) || searchMutation.isPending}
            size="lg"
            className="w-full h-14 text-lg"
            data-testid="button-search-services"
          >
            {searchMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-5 w-5" />
                Search Services
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Found {results.length} {serviceTypes.find(t => t.value === serviceType)?.label}(s)
          </h2>
          <div className="space-y-4">
            {results.map((service, idx) => (
              <Card key={idx} className="hover-elevate" data-testid={`card-service-${idx}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2" data-testid={`text-service-name-${idx}`}>
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

                  <div className="flex gap-3">
                    <Button
                      variant="default"
                      onClick={() => openInMaps(service.latitude, service.longitude)}
                      data-testid={`button-directions-${idx}`}
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(`tel:${service.phone}`, "_self")}
                      disabled={!service.phone}
                      data-testid={`button-call-${idx}`}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call
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
