// Dummy data as fallback
const fallbackContent = {
  title: "Welcome to Our Content Page",
  body: `
    Go and edit this content from admin portal
  `,
  lastUpdated: "2024-01-15"
}

async function getContent() {
  try {
    // Fetch the most recent content from Payload's API
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/content?sort=-updatedAt&limit=1`, {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch content')
    }
    
    const data = await response.json()
    console.log('Fetched content:', data.docs?.[0]) // Debug log
    return data.docs?.[0] || fallbackContent
  } catch (error) {
    console.error('Error fetching content:', error)
    return fallbackContent
  }
}

async function getCategories() {
  try {
    // Fetch all categories from Payload's API
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/categories?sort=title&limit=10`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    
    const data = await response.json()
    console.log('Fetched categories:', data.docs) // Debug log
    return data.docs || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function ContentPage() {
  const [content, categories] = await Promise.all([
    getContent(),
    getCategories()
  ])
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {content.title}
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Last updated: {content.updatedAt ? new Date(content.updatedAt).toLocaleDateString() : fallbackContent.lastUpdated}
            </p>
            <a 
              href="/admin" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Edit in CMS
            </a>
          </div>
        </div>

        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            {content.body ? (
              <div>
                {typeof content.body === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: content.body }} />
                ) : (
                  <div>
                    {content.body.root?.children?.map((child: any, index: number) => {
                      if (child.type === 'paragraph') {
                        return (
                          <p key={index} className="mb-4">
                            {child.children?.map((textChild: any, textIndex: number) => {
                              if (textChild.type === 'text') {
                                return <span key={textIndex}>{textChild.text}</span>
                              }
                              return null
                            })}
                          </p>
                        )
                      }
                      if (child.type === 'heading' && child.tag === 'h2') {
                        return (
                          <h2 key={index} className="text-2xl font-bold mb-4 mt-6">
                            {child.children?.map((textChild: any, textIndex: number) => {
                              if (textChild.type === 'text') {
                                return <span key={textIndex}>{textChild.text}</span>
                              }
                              return null
                            })}
                          </h2>
                        )
                      }
                      if (child.type === 'heading' && child.tag === 'h3') {
                        return (
                          <h3 key={index} className="text-xl font-semibold mb-3 mt-5">
                            {child.children?.map((textChild: any, textIndex: number) => {
                              if (textChild.type === 'text') {
                                return <span key={textIndex}>{textChild.text}</span>
                              }
                              return null
                            })}
                          </h3>
                        )
                      }
                      if (child.type === 'list' && child.listType === 'bullet') {
                        return (
                          <ul key={index} className="list-disc list-inside mb-4">
                            {child.children?.map((listItem: any, listIndex: number) => (
                              <li key={listIndex} className="mb-2">
                                {listItem.children?.map((textChild: any, textIndex: number) => {
                                  if (textChild.type === 'text') {
                                    return <span key={textIndex}>{textChild.text}</span>
                                  }
                                  return null
                                })}
                              </li>
                            ))}
                          </ul>
                        )
                      }
                      return null
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: fallbackContent.body }} />
            )}
          </div>
        </div>

        
        {categories.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category: any) => (
                  <div
                    key={category.id}
                    className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {category.url && (
                      <div className="mb-3">
                        <img
                          src={category.url}
                          alt={category.title}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Slug: {category.slug}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
