import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { FlaggedEvent } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ZoomIn, ZoomOut, Play, Pause, FastForward } from 'lucide-react';

interface EcgViewerTabProps {
  events: FlaggedEvent[];
}

export function EcgViewerTab({ events }: EcgViewerTabProps) {
  const [speed, setSpeed] = useState('25');
  const [gain, setGain] = useState('10');
  const [annotations, setAnnotations] = useState(true);
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate math-based ECG path
  // Base line with noise, P wave, QRS complex, T wave
  const generateEcgPath = () => {
    let path = 'M0,150 ';
    const length = 2000;
    let x = 0;
    
    // Heart rate ~75bpm = 1.25 beats per second = ~800ms per beat
    // At 25mm/s, one beat is 20mm = ~80 units in our coordinate system
    
    for (let i = 0; i < length; i += 2) {
      x = i;
      let y = 150; // Baseline
      
      // Noise
      y += (Math.random() - 0.5) * 2;
      
      // Beat cycle (every 100 units)
      const beatPhase = x % 100;
      
      if (beatPhase > 10 && beatPhase < 25) {
        // P wave
        y -= Math.sin((beatPhase - 10) / 15 * Math.PI) * 10;
      } else if (beatPhase > 30 && beatPhase < 35) {
        // Q wave
        y += Math.sin((beatPhase - 30) / 5 * Math.PI) * 5;
      } else if (beatPhase >= 35 && beatPhase < 40) {
        // R wave
        y -= Math.sin((beatPhase - 35) / 5 * Math.PI) * 80;
      } else if (beatPhase >= 40 && beatPhase < 45) {
        // S wave
        y += Math.sin((beatPhase - 40) / 5 * Math.PI) * 15;
      } else if (beatPhase > 60 && beatPhase < 80) {
        // T wave
        y -= Math.sin((beatPhase - 60) / 20 * Math.PI) * 15;
      }
      
      // Adjust by gain
      const gainMult = parseInt(gain) / 10;
      y = 150 + (y - 150) * gainMult;
      
      path += `L${x},${y} `;
    }
    
    return path;
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.5, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.5, 0.5));

  // Medical monitor style: Dark background, bright green trace
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between bg-card p-3 rounded-md border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Speed</Label>
            <Select value={speed} onValueChange={setSpeed}>
              <SelectTrigger className="w-[100px] h-8 text-xs font-mono" data-testid="select-playback-speed">
                <SelectValue placeholder="Speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12.5">12.5 mm/s</SelectItem>
                <SelectItem value="25">25.0 mm/s</SelectItem>
                <SelectItem value="50">50.0 mm/s</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Gain</Label>
            <Select value={gain} onValueChange={setGain}>
              <SelectTrigger className="w-[100px] h-8 text-xs font-mono" data-testid="select-gain">
                <SelectValue placeholder="Gain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 mm/mV</SelectItem>
                <SelectItem value="10">10 mm/mV</SelectItem>
                <SelectItem value="20">20 mm/mV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch 
              id="annotations" 
              checked={annotations} 
              onCheckedChange={setAnnotations} 
              data-testid="toggle-annotations"
            />
            <Label htmlFor="annotations" className="text-sm">AI Annotations</Label>
          </div>
          
          <div className="flex items-center gap-1 border rounded-md">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut} data-testid="button-zoom-out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="w-12 text-center text-xs font-mono">{Math.round(zoom * 100)}%</div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn} data-testid="button-zoom-in">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
        <span className="text-xs text-muted-foreground flex items-center shrink-0">Jump to:</span>
        {events.slice(0, 5).map(e => (
          <Button key={e.id} variant="outline" size="sm" className="h-7 text-xs rounded-full shrink-0">
            {format(new Date(e.timestamp), 'HH:mm:ss')} - {e.classification}
          </Button>
        ))}
      </div>

      <div className="border rounded-lg overflow-hidden bg-slate-950 shadow-inner relative h-[400px]">
        {/* ECG Grid & Waveform */}
        <div 
          className="absolute inset-0 overflow-auto" 
          style={{ cursor: 'grab' }}
        >
          <div style={{ width: `${100 * zoom}%`, minWidth: '100%', height: '100%', minHeight: '380px' }}>
            <svg 
              ref={svgRef}
              width="100%" 
              height="100%" 
              preserveAspectRatio="none" 
              data-testid="ecg-waveform"
              className="absolute inset-0"
            >
              <defs>
                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse" data-testid="ecg-grid">
                  <rect width="50" height="50" fill="url(#smallGrid)"/>
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                </pattern>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Fake AI Annotation highlight */}
              {annotations && (
                <g>
                  <rect x="30%" y="0" width="15%" height="100%" fill="rgba(239, 68, 68, 0.15)" />
                  <rect x="30%" y="0" width="15%" height="4" fill="rgba(239, 68, 68, 0.8)" />
                  <text x="31%" y="20" fill="rgba(239, 68, 68, 0.9)" fontSize="12" fontFamily="monospace">Atrial Fibrillation (92%)</text>
                </g>
              )}
              
              {/* Waveform */}
              <path 
                d={generateEcgPath()} 
                fill="none" 
                stroke="#10b981" /* bright green */
                strokeWidth={1.5 / zoom} 
                strokeLinejoin="round"
                className="drop-shadow-[0_0_2px_rgba(16,185,129,0.5)]"
              />
            </svg>
          </div>
        </div>

        {/* Axes labels overlay */}
        <div className="absolute bottom-2 left-4 text-[10px] text-white/50 font-mono" data-testid="ecg-time-axis">
          Time → (1 sec = {speed}mm)
        </div>
        <div className="absolute top-1/2 left-2 -translate-y-1/2 -rotate-90 origin-left text-[10px] text-white/50 font-mono" data-testid="ecg-amplitude-axis">
          Amplitude (1mV = {gain}mm)
        </div>
      </div>
    </div>
  );
}
