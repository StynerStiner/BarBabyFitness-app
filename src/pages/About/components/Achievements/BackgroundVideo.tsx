export const BackgroundVideo = () => {
  return (
    <div className="absolute inset-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      >
        <source src="/videos/keeppushing.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
    </div>
  );
};
