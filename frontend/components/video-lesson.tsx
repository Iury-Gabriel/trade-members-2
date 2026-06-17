export function VideoLesson({ title, videoUrl }: { title: string; videoUrl?: string }) {
  return (
    <div className="flex justify-center">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black lg:w-[80%]">
        {videoUrl ? (
          <iframe
            src={`${videoUrl}?autoplay=false&preload=true`}
            className="absolute inset-0 h-full w-full"
            allowFullScreen
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Vídeo não disponível</p>
          </div>
        )}
      </div>
    </div>
  )
}
