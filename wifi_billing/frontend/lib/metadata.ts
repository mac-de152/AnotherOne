import { Metadata } from 'next'
import { PROJECT_NAME } from './constants'

export interface PageMetadataOptions {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  noIndex?: boolean
}

export function generateMetadata(options: PageMetadataOptions = {}): Metadata {
  const {
    title = PROJECT_NAME,
    description = 'WiFi Billing System - Fast, reliable, and affordable internet access',
    keywords = ['WiFi', 'internet', 'billing', 'M-Pesa', 'Kenya', 'Qonnect'],
    image = '/og-image.jpg',
    noIndex = false
  } = options

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [image],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
  }
}

export function generatePageMetadata(
  pageTitle: string,
  description?: string,
  options: Partial<PageMetadataOptions> = {}
): Metadata {
  const fullTitle = `${pageTitle} - ${PROJECT_NAME}`
  
  return generateMetadata({
    title: fullTitle,
    description,
    ...options
  })
}

// Predefined metadata for common pages
export const homeMetadata = generatePageMetadata('Home', 'Fast, reliable, and affordable WiFi internet access powered by M-Pesa payments.')
export const aboutMetadata = generatePageMetadata('About Us', 'Learn about Qonnect WiFi, our mission, team, and commitment to providing quality internet services.')
export const adminMetadata = generatePageMetadata('Admin Dashboard', 'Manage users, transactions, and system settings for the WiFi billing system.')
export const supportMetadata = generatePageMetadata('Support', 'Get help with your WiFi connection, billing, or technical issues.')
export const packagesMetadata = generatePageMetadata('WiFi Packages', 'Choose from our range of WiFi packages with different speeds and durations.')

// Dynamic metadata for product pages
export function generateProductMetadata(productName: string, description?: string): Metadata {
  return generatePageMetadata(
    productName,
    description || `Details and information about ${productName}`,
    { keywords: ['WiFi package', productName, 'internet', 'billing'] }
  )
}

// Loading state metadata
export const loadingMetadata = generatePageMetadata('Loading...', 'Please wait while we load your content.')
