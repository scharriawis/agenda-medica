import { PageProps as InertiaPageProps } from '@inertiajs/core'

export interface User {
  id: number
  name: string
  email: string
  role: string
}

declare module '@inertiajs/core' {
  export interface PageProps extends InertiaPageProps {
    auth: {
      user: User
    }
  }
}
