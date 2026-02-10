import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchStore } from '@/stores/searchStore'
import { useDebounce } from '@/hooks/useDebounce'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { api } from '@/lib/api/axios'

export const GlobalSearch = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isOpen, query, results, setIsOpen, setQuery, setResults, clearSearch } =
    useSearchStore()
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  // Search API call
  useEffect(() => {
    const searchItems = async () => {
      if (!debouncedQuery.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        // Search across courses and labs
        const [coursesRes, labsRes] = await Promise.all([
          api.get('/courses', { params: { search: debouncedQuery, limit: 5 } }),
          api.get('/labs', { params: { search: debouncedQuery, limit: 5 } }),
        ])

        const combinedResults = [
          ...coursesRes.data.data.map((item: any) => ({
            id: item.id,
            title: item.title || item.ar_title,
            type: 'course' as const,
            url: `/courses/${item.id}`,
          })),
          ...labsRes.data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            type: 'lab' as const,
            url: `/labs/${item.id}`,
          })),
        ]

        setResults(combinedResults)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    searchItems()
  }, [debouncedQuery, setResults])

  const handleItemClick = (url: string) => {
    navigate(url)
    setIsOpen(false)
    clearSearch()
  }

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setIsOpen])

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-secondary/50 rounded-md hover:bg-secondary transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>{t('search.placeholder')}</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Mobile Search Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Search className="w-5 h-5" /> {/* Show only icon on mobile */}
      </button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle className="sr-only">{t('search.placeholder')}</DialogTitle>
          </DialogHeader>

          {/* Search Input */}
          <div className="relative px-4">
            <Search className="absolute left-7 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="pl-10 h-12 text-base"
              autoFocus
            />
            {isLoading && (
              <Loader2 className="absolute right-7 top-3 w-5 h-5 animate-spin text-primary" />
            )}
          </div>

          {/* Results */}
          <ScrollArea className="max-h-[400px] px-4 pb-4">
            {results.length > 0 ? (
              <div className="space-y-2 mt-4">
                {results.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.url)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.type === 'course' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                      />
                      <span className="text-sm font-medium group-hover:text-primary">
                        {item.title}
                      </span>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {item.type}
                    </Badge>
                  </button>
                ))}
              </div>
            ) : query && !isLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                {t('search.noResults')}
              </div>
            ) : null}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
