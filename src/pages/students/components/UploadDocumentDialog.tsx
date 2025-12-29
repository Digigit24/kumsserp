/**
 * Upload/Edit Document Drawer
 */

import React, { useState } from 'react';
import { SideDrawer, SideDrawerContent } from '../../../components/common/SideDrawer';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Upload } from 'lucide-react';
import { useCreateStudentDocument, useUpdateStudentDocument } from '../../../hooks/useStudentDocuments';
import type { StudentDocument } from '../../../types/students.types';
import { Checkbox } from '../../../components/ui/checkbox';

interface UploadDocumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    studentId: number;
    onSuccess?: () => void;
    document?: StudentDocument;
}

export const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
    open,
    onOpenChange,
    studentId,
    onSuccess,
    document,
}) => {
    const createMutation = useCreateStudentDocument();
    const updateMutation = useUpdateStudentDocument();
    const isEdit = !!document;

    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        document_type: 'other',
        document_name: '',
        notes: '',
        is_verified: false,
        verified_by: '',
        verified_date: '',
        is_active: true,
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            // Auto-fill document name from filename if empty
            if (!formData.document_name) {
                handleChange('document_name', e.target.files[0].name);
            }
        }
    };

    React.useEffect(() => {
        if (document) {
            setFormData({
                document_type: document.document_type || 'other',
                document_name: document.document_name || '',
                notes: document.notes || '',
                is_verified: document.is_verified || false,
                verified_by: document.verified_by || '',
                verified_date: document.verified_date || '',
                is_active: document.is_active !== undefined ? document.is_active : true,
            });
            setFile(null);
        } else if (open) {
            setFormData({
                document_type: 'other',
                document_name: '',
                notes: '',
                is_verified: false,
                verified_by: '',
                verified_date: '',
                is_active: true,
            });
            setFile(null);
        }
    }, [document, open]);

    const handleSubmit = async () => {
        try {
            if (isEdit && document) {
                await updateMutation.mutateAsync({
                    id: document.id,
                    data: {
                        document_type: formData.document_type,
                        document_name: formData.document_name,
                        notes: formData.notes,
                        is_verified: formData.is_verified,
                        verified_by: formData.verified_by || null,
                        verified_date: formData.verified_date || null,
                        is_active: formData.is_active,
                    },
                });
            } else {
                if (!file) {
                    alert('Please select a file to upload');
                    return;
                }

                const payload = new FormData();
                payload.append('student', studentId.toString());
                payload.append('document_type', formData.document_type);
                payload.append('document_name', formData.document_name);
                payload.append('document_file', file);
                if (formData.notes) {
                    payload.append('notes', formData.notes);
                }
                payload.append('is_verified', formData.is_verified.toString());
                if (formData.verified_by) {
                    payload.append('verified_by', formData.verified_by);
                }
                if (formData.verified_date) {
                    payload.append('verified_date', formData.verified_date);
                }
                payload.append('is_active', formData.is_active.toString());

                await createMutation.mutateAsync(payload as any);
            }

            onSuccess?.();
            onOpenChange(false);
            setFile(null);
            setFormData({ document_type: 'other', document_name: '', notes: '', is_verified: false, verified_by: '', verified_date: '', is_active: true });
        } catch (error) {
            console.error('Failed to save document:', error);
            alert('Failed to save document. Please try again.');
        }
    };

    return (
        <SideDrawer open={open} onOpenChange={onOpenChange}>
            <SideDrawerContent
                title={isEdit ? 'Edit Document' : 'Upload Document'}
                description={isEdit ? 'Update document metadata or verification.' : 'Upload a supporting document for this student.'}
                size="md"
                footer={
                    <div className="flex items-center justify-end gap-3">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            loading={createMutation.isPending || updateMutation.isPending}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {isEdit ? 'Save Changes' : 'Upload'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Document Type *</Label>
                        <Select value={formData.document_type} onValueChange={(value) => handleChange('document_type', value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="id_proof">ID Proof</SelectItem>
                                <SelectItem value="address_proof">Address Proof</SelectItem>
                                <SelectItem value="birth_certificate">Birth Certificate</SelectItem>
                                <SelectItem value="marksheet">Marksheet</SelectItem>
                                <SelectItem value="transfer_certificate">Transfer Certificate</SelectItem>
                                <SelectItem value="character_certificate">Character Certificate</SelectItem>
                                <SelectItem value="photo">Photo</SelectItem>
                                <SelectItem value="medical_certificate">Medical Certificate</SelectItem>
                                <SelectItem value="income_certificate">Income Certificate</SelectItem>
                                <SelectItem value="caste_certificate">Caste Certificate</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Document Name *</Label>
                        <Input
                            value={formData.document_name}
                            onChange={(e) => handleChange('document_name', e.target.value)}
                            placeholder="e.g., Aadhar Card"
                        />
                    </div>

                    {!isEdit && (
                        <div className="space-y-2">
                            <Label>Select File *</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                />
                            </div>
                            {file && (
                                <p className="text-sm text-muted-foreground">
                                    Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                </p>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            placeholder="Additional notes about this document..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-3 border-t pt-3">
                        <label className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer select-none">
                            <Checkbox
                                id="is_verified"
                                checked={formData.is_verified}
                                onCheckedChange={(checked) => handleChange('is_verified', Boolean(checked))}
                            />
                            <span className="text-sm">Mark as verified</span>
                        </label>

                        {formData.is_verified && (
                            <>
                                <div className="space-y-2">
                                    <Label>Verified By (User UUID)</Label>
                                    <Input
                                        value={formData.verified_by}
                                        onChange={(e) => handleChange('verified_by', e.target.value)}
                                        placeholder="Enter verifier user UUID"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Verified Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.verified_date}
                                        onChange={(e) => handleChange('verified_date', e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <label className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer select-none">
                            <Checkbox
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => handleChange('is_active', Boolean(checked))}
                            />
                            <span className="text-sm">Active Document</span>
                        </label>
                    </div>
                </div>
            </SideDrawerContent>
        </SideDrawer>
    );
};
