/**
 * Custom hook for landing component interactions (save/favorite)
 * @module shared/components/landing/hooks
 */

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

interface UseLandingActionsProps {
  initialSaved?: boolean
  initialFavorite?: boolean
  onSave?: () => void | Promise<void>
  onFavorite?: () => void | Promise<void>
}

export function useLandingActions({
  initialSaved = false,
  initialFavorite = false,
  onSave,
  onFavorite,
}: UseLandingActionsProps = {}) {
  const { t } = useTranslation('common')
  const [saved, setSaved] = useState(initialSaved)
  const [favorite, setFavorite] = useState(initialFavorite)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true)
      const newSavedState = !saved
      setSaved(newSavedState)

      if (onSave) {
        await onSave()
      }

      // Show success toast
      toast.success(
        newSavedState
          ? t('actions.saved')
          : t('actions.unsaved')
      )
    } catch (error) {
      // Revert on error
      setSaved(saved)
      toast.error(t('actions.error'))
      console.error('Save action failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [saved, onSave, t])

  const handleFavorite = useCallback(async () => {
    try {
      setIsLoading(true)
      const newFavoriteState = !favorite
      setFavorite(newFavoriteState)

      if (onFavorite) {
        await onFavorite()
      }

      // Show success toast
      toast.success(
        newFavoriteState
          ? t('actions.favorited')
          : t('actions.unfavorited')
      )
    } catch (error) {
      // Revert on error
      setFavorite(favorite)
      toast.error(t('actions.error'))
      console.error('Favorite action failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [favorite, onFavorite, t])

  return {
    saved,
    favorite,
    isLoading,
    handleSave,
    handleFavorite,
  }
}
