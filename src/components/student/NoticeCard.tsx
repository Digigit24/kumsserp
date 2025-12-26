import React from 'react';
import { Bell, Calendar, AlertCircle, Download, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Notice } from '@/types/student-portal.types';
import { cn } from '@/lib/utils';

interface NoticeCardProps {
  notice: Notice;
  onDownloadAttachment?: (attachmentId: number) => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onDownloadAttachment }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'default';
      case 'event':
        return 'success';
      case 'holiday':
        return 'warning';
      case 'urgent':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card
      className={cn(
        'hover:shadow-lg transition-shadow',
        notice.pinned && 'border-l-4 border-l-orange-500',
        notice.priority === 'important' && 'border-l-4 border-l-destructive'
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {notice.priority === 'important' && (
                <AlertCircle className="h-5 w-5 text-destructive" />
              )}
              {notice.title}
            </CardTitle>
            <CardDescription>
              Published on {new Date(notice.publishedDate).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge variant={getCategoryColor(notice.category)}>
            {notice.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{notice.description}</p>

        {notice.attachments && notice.attachments.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Attachments:</p>
            {notice.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-background"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{attachment.fileName}</p>
                    <p className="text-xs text-muted-foreground">{attachment.fileSize}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownloadAttachment?.(attachment.id)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {notice.validUntil && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Valid until {new Date(notice.validUntil).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
