import { Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Result, Spin, Button } from 'antd'
import { lessonBySlug } from '@/lessons/registry'

export default function LessonPage() {
  const { slug = '' } = useParams()
  const meta = lessonBySlug(slug)

  if (!meta) {
    return (
      <Result
        status="404"
        title="Lesson not found"
        extra={
          <Link to="/">
            <Button type="primary">Back home</Button>
          </Link>
        }
      />
    )
  }

  const LazyLesson = meta.Component

  return (
    <Suspense
      fallback={
        <div className="grid h-[60vh] place-items-center">
          <Spin size="large" />
        </div>
      }
    >
      {/* key={slug} guarantees a clean remount when navigating lesson→lesson */}
      <LazyLesson key={slug} />
    </Suspense>
  )
}
