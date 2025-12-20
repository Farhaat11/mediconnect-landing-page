import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Mic, MicOff, Video, VideoOff, PhoneOff, User } from "lucide-react";

const VideoCallUI = ({ consultation, userType, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const otherPartyName = userType === "patient" 
    ? consultation.doctorName 
    : consultation.patientName;

  return (
    <div className="fixed inset-0 bg-foreground z-50 flex flex-col">
      {/* Header */}
      <div className="bg-card/10 backdrop-blur-sm p-4 flex items-center justify-between">
        <div className="text-primary-foreground">
          <p className="text-sm opacity-70">In call with</p>
          <p className="font-semibold">{otherPartyName}</p>
        </div>
        <div className="text-primary-foreground text-right">
          <p className="text-sm opacity-70">{consultation.specialization}</p>
          <p className="text-xs opacity-50">ID: {consultation.id}</p>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative p-4">
        {/* Remote Video (Large) */}
        <div className="w-full h-full bg-muted/20 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <User className="w-16 h-16 text-primary-foreground/50" />
            </div>
            <p className="text-primary-foreground/70 text-lg">{otherPartyName}</p>
            <p className="text-primary-foreground/50 text-sm">Waiting to connect...</p>
          </div>
        </div>

        {/* Local Video (Small - Picture in Picture) */}
        <div className="absolute bottom-8 right-8 w-40 h-56 bg-muted/30 rounded-xl border-2 border-primary/30 overflow-hidden">
          {isCameraOn ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center mx-auto mb-2">
                  <User className="w-8 h-8 text-primary-foreground/70" />
                </div>
                <p className="text-primary-foreground/70 text-xs">You</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/50">
              <div className="text-center">
                <VideoOff className="w-8 h-8 text-primary-foreground/50 mx-auto mb-2" />
                <p className="text-primary-foreground/50 text-xs">Camera off</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card/10 backdrop-blur-sm p-6">
        <div className="flex items-center justify-center gap-4">
          {/* Mute Button */}
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="lg"
            className="w-14 h-14 rounded-full"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          {/* Camera Button */}
          <Button
            variant={!isCameraOn ? "destructive" : "secondary"}
            size="lg"
            className="w-14 h-14 rounded-full"
            onClick={() => setIsCameraOn(!isCameraOn)}
          >
            {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          {/* End Call Button */}
          <Button
            variant="destructive"
            size="lg"
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700"
            onClick={onEndCall}
          >
            <PhoneOff className="w-7 h-7" />
          </Button>
        </div>

        <p className="text-center text-primary-foreground/50 text-sm mt-4">
          This is a mock video consultation interface
        </p>
      </div>
    </div>
  );
};

export default VideoCallUI;
