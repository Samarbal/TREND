'use client'

import { useTranslations } from 'next-intl';
import { useState } from 'react'
import { apiRequest } from '@/lib/api'
import { Brand } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteBrandDialogProps {
  brand: Brand
  open: boolean
  onOpenChange: (open: boolean) => void
  onBrandDeleted: () => void
}

export function DeleteBrandDialog({
  brand,
  open,
  onOpenChange,
  onBrandDeleted,
}: DeleteBrandDialogProps) {
  const t = useTranslations('components.brand.delete-brand-dialog');
  const [confirmName, setConfirmName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canDelete = confirmName === brand.name && !loading

  const handleDelete = async () => {
    setLoading(true)
    setError(null)
    try {
      await apiRequest(`/brands/${brand.id}`, {
        method: 'DELETE',
        body: JSON.stringify({ confirm_name: confirmName }),
      })
      onBrandDeleted()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_delete_brand'))
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmName('')
      setError(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">{t('delete_confirm_title', { name: brand.name })}</DialogTitle>
          <DialogDescription>{t('this_removes_the_brand')}</DialogDescription>
        </DialogHeader>
        <div>
          <p className="text-[13px]">{t('type')}<strong>&quot;{brand.name}&quot;</strong>{t('to_confirm')}</p>
          <Input
            type="text"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={t('type_brand_name_to')}
            className="mt-2"
          />
          {error && <p className="mt-2 text-[13px] text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>{t('cancel')}</Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDelete}
          >
            {loading ? t('deleting') : t('delete_brand')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
