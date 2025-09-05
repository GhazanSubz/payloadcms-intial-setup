import type { CollectionConfig } from 'payload'

export const Content: CollectionConfig = {
  slug: 'content',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
  },
  access: {
    read: () => true, 
    create: ({ req: { user } }) => Boolean(user), 
    update: ({ req: { user } }) => Boolean(user), 
    delete: ({ req: { user } }) => Boolean(user), 
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the content',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      admin: {
        description: 'The main content body',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      defaultValue: 'homepage-content',
      admin: {
        description: 'Unique identifier for this content (e.g., "homepage-content")',
      },
    },
  ],
}
