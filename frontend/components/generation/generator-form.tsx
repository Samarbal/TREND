// D:\Level4\TREND\frontend\components\generation\generator-form.tsx

'use client'

import { useEffect, useState } from 'react'
import { Download, Loader2, Sparkles } from 'lucide-react'
import { useActiveKeys } from '@/hooks/use-active-keys'
import { useGenerate } from '@/hooks/use-generate'
import { LogoModeSelector } from '@/components/generation/logo-mode-selector'
import { PresetSelector } from '@/components/generation/preset-selector'
import { ProviderSelector } from '@/components/generation/provider-selector'
import { CanvasStage } from '@/components/generation/canvas-stage'
import { ErrorMessage } from '@/components/generation/error-message'
import { Button } from '@/components/ui/button'
import { downloadImageFile } from '@/lib/download'
import { PLATFORM_PRESETS } from '@/lib/presets'
import type { LogoMode, PlatformPreset, Provider } from '@/types'
import {
  EMPTY_GENERATION_BRIEF,
  GenerationBriefForm,
} from '@/components/generation/generation-brief-form'
import type { GenerationBrief } from '@/types/generation'

interface GeneratorFormProps {
  brandId: string
  brandName: string
  brandHasLogo: boolean
}

export function GeneratorForm({ brandId, brandName, brandHasLogo }: GeneratorFormProps) {
  const [brief, setBrief] = useState<GenerationBrief>(EMPTY_GENERATION_BRIEF)
  const [briefReviewed, setBriefReviewed] = useState(false)
  const [provider, setProvider] = useState<Provider>('openai')
  const [preset, setPreset] = useState<PlatformPreset>('instagram_post')
  const [logoMode, setLogoMode] = useState<LogoMode>('none')
  const [providerInitialized, setProviderInitialized] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const { activeKeys, loading: keysLoading } = useActiveKeys(brandId)
  const { state, generate, reset } = useGenerate(brandId)

  useEffect(() => {
    setProviderInitialized(false)
  }, [brandId])

  useEffect(() => {
    if (keysLoading || providerInitialized) return

    if (activeKeys.openaiActive && !activeKeys.geminiActive) {
      setProvider('openai')
    } else if (!activeKeys.openaiActive && activeKeys.geminiActive) {
      setProvider('gemini')
    } else if (activeKeys.openaiActive && activeKeys.geminiActive) {
      setProvider('gemini')
    } else {
      setProvider('openai')
    }

    setProviderInitialized(true)
  }, [keysLoading, activeKeys, providerInitialized])

  const submitting = state.status === 'submitting'
  const hasActiveKey =
    (provider === 'openai' && activeKeys.openaiActive) ||
    (provider === 'gemini' && activeKeys.geminiActive)
  const generateDisabled = submitting || !briefReviewed || !hasActiveKey

  const presetInfo = PLATFORM_PRESETS[preset]
  const canvasStatus =
    state.status === 'submitting' ? 'generating' : state.status === 'success' ? 'done' : 'empty'


  function handleBriefChange(nextBrief: GenerationBrief) {
    setBrief(nextBrief)
    setBriefReviewed(false)
  }

  function handlePresetChange(next: PlatformPreset) {
    if (state.status === 'success') reset()
    setPreset(next)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (generateDisabled) return

    setDownloadError(null)

    await generate({
      brief,
      provider,
      platform_preset: preset,
      logo_mode: logoMode,
    })
  }

  async function handleDownload() {
    if (state.status !== 'success') return

    const { result } = state
    if (!result.image_url || !result.download_filename) return

    setDownloading(true)
    setDownloadError(null)

    try {
      await downloadImageFile(result.image_url, result.download_filename)
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Download failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const result = state.status === 'success' ? state.result : null
  const canDownload = Boolean(result?.image_url && result?.download_filename)

  return (
    <div className="grid gap-[22px] xl:grid-cols-[minmax(380px,460px)_1fr] xl:items-start">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div>
          <h1 className="text-[30px] font-semibold leading-[1.16] tracking-tight">Generate</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Answer a few questions and TRENDY AI will create an image that matches {brandName}&apos;s identity.
          </p>
        </div>

        <div>
          <GenerationBriefForm
            value={brief}
            onChange={handleBriefChange}
            onComplete={(completedBrief) => {
              setBrief(completedBrief)
              setBriefReviewed(true)
            }}
            platformPreset={preset}
            brandId={brandId}
            brandName={brandName}
            disabled={submitting}
          />
        </div>

        <div className="space-y-3 border-t border-border-subtle pt-3">
          <PresetSelector value={preset} onChange={handlePresetChange} disabled={submitting} />

          <div className="grid gap-3 sm:grid-cols-2">
            <ProviderSelector
              value={provider}
              onChange={setProvider}
              activeKeys={activeKeys}
              brandId={brandId}
              disabled={submitting}
            />
            <LogoModeSelector
              value={logoMode}
              onChange={setLogoMode}
              brandHasLogo={brandHasLogo}
              brandId={brandId}
              disabled={submitting}
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={generateDisabled}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Painting…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate
              </>
            )}
          </Button>

          {!hasActiveKey && (
            <p className="text-[12px] text-muted-foreground">
              Add an active provider key before generating.
            </p>
          )}

          {state.status === 'error' && (
            <ErrorMessage code={state.code} message={state.message} brandId={brandId} />
          )}
        </div>
      </form>

      <div className="flex min-w-0 flex-col gap-3 xl:sticky xl:top-6">
        <CanvasStage
          status={canvasStatus}
          preset={presetInfo}
          brandName={brandName}
          imageUrl={result?.image_url}
          imageAlt={result?.prompt}
        />

        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[12px] text-muted-foreground">
            {presetInfo.width} × {presetInfo.height} · {presetInfo.label} · {result?.provider ?? provider}
          </p>
          <Button
            type="button"
            variant={canDownload ? 'default' : 'secondary'}
            onClick={handleDownload}
            disabled={!canDownload || downloading}
          >
            <Download className="h-4 w-4" />
            {downloading ? 'Downloading…' : 'Download'}
          </Button>
        </div>

        {downloadError && <p className="text-[12px] text-destructive">{downloadError}</p>}
      </div>
    </div>
  )
}