import React, { useState } from 'react';
import { ArrowLeft, Upload, Camera, FileText, User, Shield, CheckCircle, XCircle, AlertCircle, Eye, Fingerprint, CreditCard, IdCard, Clock, Download, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface EKYCApplicationProps {
  onClose: () => void;
  userInfo: {
    name: string;
    organization: string;
  };
}

interface DocumentData {
  type: 'aadhaar' | 'pan';
  number: string;
  name: string;
  fatherName?: string;
  dob: string;
  address?: string;
  panNumber?: string;
  aadhaarNumber?: string;
}

interface VerificationStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
  details?: string;
}

const EKYCApplication = ({ onClose, userInfo }: EKYCApplicationProps) => {
  const [currentStep, setCurrentStep] = useState<'selection' | 'upload' | 'processing' | 'verification' | 'biometric' | 'results'>('selection');
  const [selectedDocType, setSelectedDocType] = useState<'aadhaar' | 'pan' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failed' | null>(null);
  const [biometricVerified, setBiometricVerified] = useState(false);

  const aadhaarMockData: DocumentData = {
    type: 'aadhaar',
    number: '1234 5678 9012',
    name: 'PRIYA SHARMA',
    fatherName: 'RAJESH SHARMA',
    dob: '15/03/1990',
    address: '123, MG Road, Bandra West, Mumbai - 400050, Maharashtra'
  };

  const panMockData: DocumentData = {
    type: 'pan',
    number: 'ABCDE1234F',
    name: 'PRIYA SHARMA',
    fatherName: 'RAJESH SHARMA',
    dob: '15/03/1990',
    panNumber: 'ABCDE1234F'
  };

  const initializeVerificationSteps = (docType: 'aadhaar' | 'pan') => {
    const baseSteps = [
      {
        id: 'upload',
        name: 'Document Upload',
        status: 'completed' as const,
        description: 'Document successfully uploaded',
        details: 'File validated and accepted'
      },
      {
        id: 'ocr',
        name: 'OCR Processing',
        status: 'processing' as const,
        description: 'Extracting data from document',
        details: 'AI-powered text recognition in progress'
      },
      {
        id: 'validation',
        name: 'Data Validation',
        status: 'pending' as const,
        description: 'Validating extracted information',
        details: 'Checking format and authenticity'
      },
      {
        id: 'govt_verify',
        name: 'Government Verification',
        status: 'pending' as const,
        description: docType === 'aadhaar' ? 'UIDAI verification' : 'Income Tax Department verification',
        details: 'Verifying with official database'
      }
    ];

    if (docType === 'aadhaar') {
      baseSteps.push({
        id: 'biometric',
        name: 'Biometric Verification',
        status: 'pending' as const,
        description: 'Fingerprint authentication',
        details: 'Secure biometric matching'
      });
    }

    baseSteps.push({
      id: 'final',
      name: 'Final Verification',
      status: 'pending' as const,
      description: 'Completing KYC process',
      details: 'Generating verification report'
    });

    setVerificationSteps(baseSteps);
  };

  const handleDocumentTypeSelection = (type: 'aadhaar' | 'pan') => {
    setSelectedDocType(type);
    setCurrentStep('upload');
    toast.success(`${type === 'aadhaar' ? 'Aadhaar' : 'PAN'} verification selected`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image or PDF file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB');
        return;
      }

      setUploadedFile(file);
      toast.success('Document uploaded successfully');
    }
  };

  const startVerificationProcess = () => {
    if (!selectedDocType || !uploadedFile) {
      toast.error('Please upload a document first');
      return;
    }

    setCurrentStep('processing');
    initializeVerificationSteps(selectedDocType);
    setIsProcessing(true);

    // Simulate OCR processing
    setTimeout(() => {
      setVerificationSteps(prev => prev.map(step => 
        step.id === 'ocr' ? { ...step, status: 'completed', details: 'Text extraction successful' } : step
      ));

      // Set mock document data
      setDocumentData(selectedDocType === 'aadhaar' ? aadhaarMockData : panMockData);
      toast.success('Document data extracted successfully');

      // Start validation
      setTimeout(() => {
        setVerificationSteps(prev => prev.map(step => 
          step.id === 'validation' ? { ...step, status: 'processing' } : step
        ));

        setTimeout(() => {
          setVerificationSteps(prev => prev.map(step => 
            step.id === 'validation' ? { ...step, status: 'completed', details: 'Document format validated' } : step
          ));

          // Start government verification
          setTimeout(() => {
            setVerificationSteps(prev => prev.map(step => 
              step.id === 'govt_verify' ? { ...step, status: 'processing' } : step
            ));

            setTimeout(() => {
              setVerificationSteps(prev => prev.map(step => 
                step.id === 'govt_verify' ? { ...step, status: 'completed', details: 'Verified with official database' } : step
              ));

              if (selectedDocType === 'aadhaar') {
                setCurrentStep('biometric');
                toast.info('Please complete biometric verification');
              } else {
                setCurrentStep('results');
                setVerificationResult('success');
                setVerificationSteps(prev => prev.map(step => 
                  step.id === 'final' ? { ...step, status: 'completed', details: 'KYC verification completed' } : step
                ));
                toast.success('PAN verification completed successfully');
              }
              setIsProcessing(false);
            }, 2000);
          }, 1500);
        }, 1500);
      }, 1000);
    }, 2000);
  };

  const handleBiometricVerification = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setBiometricVerified(true);
      setVerificationSteps(prev => prev.map(step => 
        step.id === 'biometric' ? { ...step, status: 'completed', details: 'Fingerprint matched successfully' } : step
      ));
      
      setTimeout(() => {
        setVerificationSteps(prev => prev.map(step => 
          step.id === 'final' ? { ...step, status: 'completed', details: 'KYC verification completed' } : step
        ));
        setCurrentStep('results');
        setVerificationResult('success');
        setIsProcessing(false);
        toast.success('Aadhaar verification completed successfully');
      }, 1500);
    }, 3000);
  };

  const downloadReport = () => {
    toast.success('Verification report downloaded successfully');
  };

  const restartProcess = () => {
    setCurrentStep('selection');
    setSelectedDocType(null);
    setUploadedFile(null);
    setDocumentData(null);
    setVerificationSteps([]);
    setIsProcessing(false);
    setVerificationResult(null);
    setBiometricVerified(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Eye className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-foreground">E-KYC Verification</span>
          </div>
          <Badge variant="outline" className="border-blue-600 text-blue-600">
            {userInfo.organization}
          </Badge>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-card border-b border-border px-6 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep === 'selection' ? 'text-blue-600' : currentStep === 'upload' || currentStep === 'processing' || currentStep === 'verification' || currentStep === 'biometric' || currentStep === 'results' ? 'text-green-600' : 'text-muted-foreground'}`}>
              <div className={`h-3 w-3 rounded-full ${currentStep === 'selection' ? 'bg-blue-600' : currentStep === 'upload' || currentStep === 'processing' || currentStep === 'verification' || currentStep === 'biometric' || currentStep === 'results' ? 'bg-green-600' : 'bg-muted'}`} />
              <span className="text-sm">Document Selection</span>
            </div>
            <div className={`h-px w-8 ${currentStep === 'upload' || currentStep === 'processing' || currentStep === 'verification' || currentStep === 'biometric' || currentStep === 'results' ? 'bg-green-600' : 'bg-muted'}`} />
            <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-blue-600' : currentStep === 'processing' || currentStep === 'verification' || currentStep === 'biometric' || currentStep === 'results' ? 'text-green-600' : 'text-muted-foreground'}`}>
              <div className={`h-3 w-3 rounded-full ${currentStep === 'upload' ? 'bg-blue-600' : currentStep === 'processing' || currentStep === 'verification' || currentStep === 'biometric' || currentStep === 'results' ? 'bg-green-600' : 'bg-muted'}`} />
              <span className="text-sm">Document Upload</span>
            </div>
            <div className={`h-px w-8 ${currentStep === 'processing' || currentStep === 'verification' || currentStep === 'biometric' || currentStep === 'results' ? 'bg-green-600' : 'bg-muted'}`} />
            <div className={`flex items-center space-x-2 ${currentStep === 'processing' ? 'text-blue-600' : currentStep === 'verification' || currentStep === 'biometric' || currentStep === 'results' ? 'text-green-600' : 'text-muted-foreground'}`}>
              <div className={`h-3 w-3 rounded-full ${currentStep === 'processing' ? 'bg-blue-600' : currentStep === 'verification' || currentStep === 'biometric' || currentStep === 'results' ? 'bg-green-600' : 'bg-muted'}`} />
              <span className="text-sm">Processing</span>
            </div>
            {selectedDocType === 'aadhaar' && (
              <>
                <div className={`h-px w-8 ${currentStep === 'biometric' || currentStep === 'results' ? 'bg-green-600' : 'bg-muted'}`} />
                <div className={`flex items-center space-x-2 ${currentStep === 'biometric' ? 'text-blue-600' : currentStep === 'results' ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <div className={`h-3 w-3 rounded-full ${currentStep === 'biometric' ? 'bg-blue-600' : currentStep === 'results' ? 'bg-green-600' : 'bg-muted'}`} />
                  <span className="text-sm">Biometric</span>
                </div>
              </>
            )}
            <div className={`h-px w-8 ${currentStep === 'results' ? 'bg-green-600' : 'bg-muted'}`} />
            <div className={`flex items-center space-x-2 ${currentStep === 'results' ? 'text-green-600' : 'text-muted-foreground'}`}>
              <div className={`h-3 w-3 rounded-full ${currentStep === 'results' ? 'bg-green-600' : 'bg-muted'}`} />
              <span className="text-sm">Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          {currentStep === 'selection' && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">Select Document Type</h1>
                <p className="text-muted-foreground">Choose the type of document you want to verify</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500" onClick={() => handleDocumentTypeSelection('aadhaar')}>
                  <CardHeader className="text-center">
                    <IdCard className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <CardTitle>Aadhaar Card</CardTitle>
                    <CardDescription>
                      Verify identity using Aadhaar card with biometric authentication
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">UIDAI Database Verification</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Biometric Authentication</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Address Verification</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Real-time Validation</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500" onClick={() => handleDocumentTypeSelection('pan')}>
                  <CardHeader className="text-center">
                    <CreditCard className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                    <CardTitle>PAN Card</CardTitle>
                    <CardDescription>
                      Verify identity using PAN card for financial compliance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Income Tax Dept. Verification</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Financial Compliance</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Quick Processing</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Instant Results</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 'upload' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  {selectedDocType === 'aadhaar' ? (
                    <IdCard className="h-8 w-8 text-blue-600" />
                  ) : (
                    <CreditCard className="h-8 w-8 text-purple-600" />
                  )}
                  <h1 className="text-3xl font-bold text-foreground">
                    Upload {selectedDocType === 'aadhaar' ? 'Aadhaar' : 'PAN'} Card
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  Please upload a clear image or PDF of your {selectedDocType === 'aadhaar' ? 'Aadhaar' : 'PAN'} card
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Upload</CardTitle>
                    <CardDescription>
                      Supported formats: JPG, PNG, PDF (Max size: 5MB)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg text-foreground mb-2">
                          {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {uploadedFile ? `File size: ${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` : 'JPG, PNG or PDF up to 5MB'}
                        </p>
                      </label>
                    </div>

                    {uploadedFile && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-green-800 font-medium">Document uploaded successfully</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">Upload Guidelines:</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Clear and readable text</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>All corners visible</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Good lighting conditions</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>No reflections or glare</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Original document (not photocopy)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>High resolution image</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={() => setCurrentStep('selection')}>
                        Back
                      </Button>
                      <Button 
                        onClick={startVerificationProcess} 
                        disabled={!uploadedFile}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Start Verification
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 'processing' && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">Processing Document</h1>
                <p className="text-muted-foreground">
                  Please wait while we verify your {selectedDocType === 'aadhaar' ? 'Aadhaar' : 'PAN'} card
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span>Verification Steps</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {verificationSteps.map((step, index) => (
                        <div key={step.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {step.status === 'completed' && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                            {step.status === 'processing' && (
                              <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                            )}
                            {step.status === 'failed' && (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            {step.status === 'pending' && (
                              <Clock className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{step.name}</p>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                            {step.details && (
                              <p className="text-xs text-muted-foreground mt-1">{step.details}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {documentData && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <User className="h-5 w-5 text-green-600" />
                          <span>Extracted Data</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              {documentData.type === 'aadhaar' ? 'Aadhaar Number' : 'PAN Number'}
                            </Label>
                            <p className="text-foreground font-mono">{documentData.number}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                            <p className="text-foreground">{documentData.name}</p>
                          </div>
                          {documentData.fatherName && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Father's Name</Label>
                              <p className="text-foreground">{documentData.fatherName}</p>
                            </div>
                          )}
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                            <p className="text-foreground">{documentData.dob}</p>
                          </div>
                          {documentData.address && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                              <p className="text-foreground text-sm">{documentData.address}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'biometric' && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">Biometric Verification</h1>
                <p className="text-muted-foreground">
                  Please complete fingerprint authentication for Aadhaar verification
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center flex items-center justify-center space-x-2">
                      <Fingerprint className="h-6 w-6 text-blue-600" />
                      <span>Fingerprint Authentication</span>
                    </CardTitle>
                    <CardDescription className="text-center">
                      Place your finger on the scanner to complete verification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="relative inline-block">
                        <div className={`h-32 w-32 rounded-full mx-auto flex items-center justify-center transition-all ${biometricVerified ? 'bg-green-100 border-4 border-green-500' : 'bg-blue-50 border-4 border-blue-300 animate-pulse'}`}>
                          <Fingerprint className={`h-16 w-16 ${biometricVerified ? 'text-green-600' : 'text-blue-600'}`} />
                        </div>
                        {biometricVerified && (
                          <CheckCircle className="h-8 w-8 text-green-600 absolute -top-2 -right-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>

                    {!biometricVerified ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                          <p className="text-blue-800 text-sm">
                            Please place your finger on the biometric scanner and hold steady
                          </p>
                        </div>
                        <Button 
                          onClick={handleBiometricVerification}
                          disabled={isProcessing}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Authenticating...
                            </>
                          ) : (
                            <>
                              <Fingerprint className="mr-2 h-4 w-4" />
                              Start Biometric Scan
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-green-800 font-medium">Biometric verification successful</span>
                        </div>
                        <p className="text-green-700 text-sm">Your fingerprint has been matched with Aadhaar database</p>
                      </div>
                    )}

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>Secure biometric matching</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>No biometric data is stored</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>UIDAI compliant verification</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 'results' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${verificationResult === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {verificationResult === 'success' ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                </div>
                <h1 className={`text-3xl font-bold mb-2 ${verificationResult === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  Verification {verificationResult === 'success' ? 'Successful' : 'Failed'}
                </h1>
                <p className="text-muted-foreground">
                  {verificationResult === 'success' 
                    ? `${selectedDocType === 'aadhaar' ? 'Aadhaar' : 'PAN'} verification completed successfully`
                    : `${selectedDocType === 'aadhaar' ? 'Aadhaar' : 'PAN'} verification could not be completed`
                  }
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span>Verification Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {verificationSteps.map((step) => (
                        <div key={step.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {step.status === 'completed' && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                            {step.status === 'failed' && (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <div>
                              <p className="font-medium text-foreground">{step.name}</p>
                              <p className="text-sm text-muted-foreground">{step.details}</p>
                            </div>
                          </div>
                          <Badge variant={step.status === 'completed' ? 'default' : 'destructive'}>
                            {step.status === 'completed' ? 'Success' : 'Failed'}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Verification Report</CardTitle>
                      <CardDescription>Complete verification details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Document Type</Label>
                          <p className="text-foreground">{selectedDocType === 'aadhaar' ? 'Aadhaar Card' : 'PAN Card'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Verification Status</Label>
                          <p className={`${verificationResult === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {verificationResult === 'success' ? 'Verified Successfully' : 'Verification Failed'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Verified Name</Label>
                          <p className="text-foreground">{documentData?.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Verification Date</Label>
                          <p className="text-foreground">{new Date().toLocaleDateString('en-IN')}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Processed By</Label>
                          <p className="text-foreground">{userInfo.name} ({userInfo.organization})</p>
                        </div>
                      </div>

                      <div className="flex space-x-4 pt-4">
                        <Button onClick={downloadReport} className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          Download Report
                        </Button>
                        <Button variant="outline" onClick={restartProcess} className="flex-1">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          New Verification
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EKYCApplication;