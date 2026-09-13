'use client'

import { useTranslations } from 'next-intl';
import { useState } from 'react'
import { apiRequest } from '@/lib/api'
import { Brand } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CreateBrandModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBrandCreated: (brand: Brand) => void
}

export function CreateBrandModal({ open, onOpenChange, onBrandCreated }: CreateBrandModalProps) {
  const t = useTranslations('components.brand.create-brand-modal');
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const brand = await apiRequest<Brand>('/brands', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim() }),
      })
      onBrandCreated(brand)
      setName('')
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create brand')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setName('')
      setError(null)
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('create_brand')}</DialogTitle>
          <DialogDescription>{t('name_a_studio_you')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand-name">{t('brand_name')}</Label>
            <Input
              id="brand-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('enter_brand_name')}
              autoFocus
            />
          </div>
          {error && <p className="text-[13px] text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>{t('cancel')}</Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
