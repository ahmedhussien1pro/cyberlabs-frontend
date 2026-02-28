import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { cn } from "@/lib/utils"

type DownloadCardProps = {
    title: string
    description?: string
    fileUrl: string
    fileType?: string
    fileSize?: string // Optional file size display
    onDownload?: () => void // Optional callback
}

export function DownloadCardLab({
    title,
    description,
    fileUrl,
    fileType = "File",
    fileSize,
    onDownload,
}: DownloadCardProps) {
    const [downloading, setDownloading] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState(0)
    const [hovered, setHovered] = useState(false)

    // Simulate download with progress
    const handleDownload = async () => {
        setDownloading(true)
        setDownloadProgress(0)

        // Simulate progress
        const interval = setInterval(() => {
            setDownloadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 10
            })
        }, 100)

        // Simulate download completion
        setTimeout(() => {
            clearInterval(interval)
            setDownloadProgress(100)

            // Actual download
            const link = document.createElement("a")
            link.href = fileUrl
            link.download = title
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Callback if provided
            onDownload?.()

            // Reset after delay
            setTimeout(() => {
                setDownloading(false)
                setDownloadProgress(0)
            }, 500)
        }, 1000)
    }

    // Get file icon based on type
    const getFileIcon = () => {
        const type = fileType.toLowerCase()
        if (type.includes('pdf')) return '📄'
        if (type.includes('image') || type.includes('jpg') || type.includes('png')) return '🖼️'
        if (type.includes('video') || type.includes('mp4')) return '🎬'
        if (type.includes('audio') || type.includes('mp3')) return '🎵'
        if (type.includes('zip') || type.includes('rar')) return '📦'
        if (type.includes('doc') || type.includes('word')) return '📝'
        if (type.includes('xls') || type.includes('excel')) return '📊'
        if (type.includes('ppt') || type.includes('powerpoint')) return '📽️'
        return '📁'
    }

    return (
        <TooltipProvider>
            <Card
                className={cn(
                    "group w-1/2 mx-auto my-20 relative overflow-hidden transition-all duration-300",
                    "hover:shadow-xl hover:scale-[1.02]",
                    downloading && "pointer-events-none opacity-80",
                    "border-2 hover:border-primary/50"
                )}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        {/* Icon with animated background */}
                        <div className="relative">
                            <div className={cn(
                                "w-20 h-20 rounded-2xl flex items-center justify-center text-4xl",
                                "bg-gradient-to-br from-primary/10 to-secondary/10",
                                "transition-all duration-300",
                                hovered && "scale-110 rotate-3"
                            )}>
                                {getFileIcon()}
                            </div>

                            {/* File type badge */}
                            <Badge
                                variant="secondary"
                                className="absolute -bottom-2 -right-2 px-2 py-1 text-xs"
                            >
                                {fileType}
                            </Badge>
                        </div>

                        {/* Title with truncation */}
                        <div className="space-y-1 w-full">
                            <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                                {title}
                            </h3>

                            {/* Description if provided */}
                            {description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {description}
                                </p>
                            )}
                        </div>

                        {/* File metadata */}
                        {(fileSize || fileType) && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {fileType && (
                                    <span className="px-2 py-1 bg-muted rounded-full">
                                        {fileType}
                                    </span>
                                )}
                                {fileSize && (
                                    <span className="px-2 py-1 bg-muted rounded-full">
                                        {fileSize}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Download progress */}
                        {downloading && (
                            <div className="w-full space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span>Downloading...</span>
                                    <span>{downloadProgress}%</span>
                                </div>
                                <Progress value={downloadProgress} className="h-1" />
                            </div>
                        )}

                        {/* Download button with tooltip */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="default"
                                    className={cn(
                                        "w-full gap-2 transition-all",
                                        "hover:shadow-md",
                                        downloading && "cursor-wait"
                                    )}
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    variant={downloading ? "secondary" : "default"}
                                >
                                    {downloading ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <span>⬇️</span>
                                            Download {fileType}
                                        </>
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Click to download {title}</p>
                            </TooltipContent>
                        </Tooltip>

                        {/* Quick action hint */}
                        {!downloading && hovered && (
                            <div className="text-xs text-muted-foreground animate-in fade-in slide-in-from-bottom-2">
                                Click to save to your device
                            </div>
                        )}
                    </div>

                    {/* Animated background elements */}
                    <div className={cn(
                        "absolute inset-0 pointer-events-none transition-opacity duration-500",
                        hovered ? "opacity-100" : "opacity-0"
                    )}>
                        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl" />
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}