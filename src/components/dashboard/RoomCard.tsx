import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, CategoryBadge } from '@/components/ui/badge';
import { Room } from '@/lib/types';
import { Users } from 'lucide-react';
import Image from 'next/image';

interface RoomCardProps {
  room: Room & { is_available?: boolean; active_bookings_count?: number };
  onBook: (room: Room) => void;
}

export function RoomCard({ room, onBook }: RoomCardProps) {
  // Generate a predictable gradient for the placeholder image based on the room ID
  const seed = parseInt(room.id.replace(/\D/g, '').substring(0, 5)) || 12345;
  const hue = seed % 360;
  
  return (
    <Card hover className="overflow-hidden flex flex-col h-full animate-fade-in group">
      <div className="relative h-44 w-full bg-[oklch(0.97_0.01_280)] overflow-hidden">
        {room.image_url ? (
          <Image
            src={room.image_url}
            alt={room.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center text-white transition-transform duration-500 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, hsl(${hue}, 70%, 65%), hsl(${(hue + 40) % 360}, 80%, 45%))`
            }}
          >
            <span className="text-4xl font-bold opacity-30">{room.room_number.split('-')[0]}</span>
          </div>
        )}
        
        {/* Availability indicator */}
        <div className="absolute top-3 right-3 flex items-center">
          {room.is_available === false ? (
            <Badge className="bg-white/90 backdrop-blur-sm border-none shadow-sm text-[oklch(0.58_0.22_25)] gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.58_0.22_25)] relative">
                <span className="absolute inset-0 rounded-full bg-[oklch(0.58_0.22_25)] animate-ping opacity-75"></span>
              </span>
              Booked
            </Badge>
          ) : (
            <Badge className="bg-white/90 backdrop-blur-sm border-none shadow-sm text-[oklch(0.60_0.18_155)] gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.52_0.20_155)]" />
              Available
            </Badge>
          )}
        </div>
        
        <div className="absolute bottom-3 left-3">
          <CategoryBadge category={room.category} />
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="text-lg font-bold text-[oklch(0.16_0.01_265)] group-hover:text-[oklch(0.58_0.25_285)] transition-colors line-clamp-1">
              {room.name}
            </h3>
            <p className="text-sm font-medium text-[oklch(0.50_0.01_265)] mt-0.5">
              {room.room_number}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-[oklch(0.97_0.003_265)] px-2 py-1 rounded-md text-sm font-medium text-[oklch(0.40_0.02_265)] border border-[oklch(0.93_0.003_265)] shrink-0">
            <Users className="w-3.5 h-3.5" />
            {room.capacity}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {room.description && (
          <p className="text-sm text-[oklch(0.40_0.02_265)] line-clamp-2 mb-3">
            {room.description}
          </p>
        )}
        
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span 
                key={amenity}
                className="inline-block text-[11px] px-1.5 py-0.5 rounded-md bg-[oklch(0.98_0_0)] border border-[oklch(0.93_0.003_265)] text-[oklch(0.50_0.01_265)]"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="inline-block text-[11px] px-1.5 py-0.5 rounded-md bg-[oklch(0.98_0_0)] border border-[oklch(0.93_0.003_265)] text-[oklch(0.50_0.01_265)]">
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 border-t-0">
        <Button 
          className="w-full" 
          onClick={() => onBook(room)}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}
