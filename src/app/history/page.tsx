"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPaymentHistory, generateInvoiceData, type PaymentHistory } from "@/lib/firebase/subscription";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Receipt, Calendar, CreditCard, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function BillingLogs() {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { user } = useAuth();

  // Function to wait for html2pdf to be available
  const waitForHtml2Pdf = () => {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).html2pdf) {
        resolve();
        return;
      }

      // Check immediately first
      if ((window as any).html2pdf) {
        resolve();
        return;
      }

      // Then set up interval for checking
      const checkInterval = setInterval(() => {
        if ((window as any).html2pdf) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('html2pdf loading timeout'));
      }, 10000);
    });
  };

  // Load html2pdf script dynamically
  useEffect(() => {
    const loadScript = async () => {
      if (typeof window === 'undefined' || scriptLoaded) return;

      try {
        // Check if script is already loaded
        if ((window as any).html2pdf) {
          setScriptLoaded(true);
          return;
        }

        // Create and load script
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.async = true;
        
        script.onload = () => {
          console.log('html2pdf script loaded');
          setScriptLoaded(true);
        };
        
        script.onerror = (e) => {
          console.error('Error loading html2pdf script:', e);
          toast.error('Failed to load PDF generation tools');
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error('Error loading script:', error);
        toast.error('Failed to load PDF generation tools');
      }
    };

    loadScript();
  }, [scriptLoaded]);

  const downloadInvoice = async (html: string, invoiceNumber: string) => {
    if (typeof window === 'undefined') return;

    try {
      // Wait for html2pdf to be available
      await waitForHtml2Pdf();

      const element = document.createElement('div');
      element.innerHTML = html;
      document.body.appendChild(element);

      const opt = {
        margin: 0.3,
        filename: `Invoice_${invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' as const 
        },
        pagebreak: { mode: 'avoid-all' }
      } as const;

      const html2pdf = (window as any).html2pdf;
      await html2pdf().set(opt).from(element).save();

      document.body.removeChild(element);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF invoice. Please try again.');
    }
  };

  const handleDownloadInvoice = async (paymentId: string) => {
    if (!paymentId || !user) return;
    
    setDownloading(paymentId);
    try {
      const invoiceData = await generateInvoiceData(user.uid, paymentId);
      const invoiceHtml = generateInvoiceHtml(invoiceData);
      await downloadInvoice(invoiceHtml, invoiceData.invoiceNumber);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setDownloading(null);
    }
  };

  const generateInvoiceHtml = (data: any) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>INVOICE ${data.invoiceNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: 'Ubuntu Mono', monospace;
              text-transform: uppercase;
            }
    
            body { 
              font-family: 'Ubuntu Mono', monospace;
              background: white;
              color: #333;
              line-height: 1.5;
              font-size: 14px;
              letter-spacing: 0.5px;
            }
    
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background: white;
            }
    
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding-bottom: 20px;
              border-bottom: 2px solid #e0e0e0;
              margin-bottom: 25px;
            }
    
            .company-logo {
              display: flex;
              align-items: center;
              gap: 15px;
            }
    
            .logo-img {
              width: 120px;
              height: auto;
              object-fit: contain;
            }
    
            .company-info {
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
    
            .company-info h1 {
              display: none;
            }
    
            .company-info .tagline {
              font-size: 13px;
              color: #666;
              margin-bottom: 8px;
              font-weight: 700;
            }
    
            .company-info .contact {
              font-size: 12px;
              color: #666;
              line-height: 1.4;
              font-weight: 400;
            }
    
            .invoice-meta {
              text-align: right;
            }
    
            .invoice-meta h2 {
              font-size: 24px;
              font-weight: 700;
              color: #333;
              margin-bottom: 12px;
              letter-spacing: 1px;
            }
    
            .invoice-meta p {
              font-size: 13px;
              margin-bottom: 4px;
              color: #666;
              font-weight: 400;
            }
    
            .invoice-meta strong {
              color: #333;
              font-weight: 700;
            }
    
            .status-paid {
              background: #28a745;
              color: white;
              padding: 6px 12px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
              margin-top: 8px;
              display: inline-block;
              letter-spacing: 1px;
            }
    
            .billing-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 25px;
              margin-bottom: 25px;
            }
    
            .billing-card {
              background: #f8f9fa;
              border: 1px solid #e9ecef;
              border-radius: 6px;
              padding: 18px;
            }
    
            .billing-card h3 {
              font-size: 16px;
              font-weight: 700;
              color: #333;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #dee2e6;
              letter-spacing: 1px;
            }
    
            .customer-name {
              font-size: 18px;
              font-weight: 700;
              color: #2874f0;
              margin-bottom: 8px;
              letter-spacing: 0.5px;
            }
    
            .billing-card p {
              margin: 6px 0;
              font-size: 13px;
              color: #666;
              display: flex;
              justify-content: space-between;
              font-weight: 400;
            }
    
            .billing-card strong {
              color: #333;
              font-weight: 700;
            }
    
            .items-section {
              margin-bottom: 25px;
            }
    
            .items-table {
              width: 100%;
              border-collapse: collapse;
              border: 1px solid #e9ecef;
              border-radius: 6px;
              overflow: hidden;
            }
    
            .items-table th {
              background: #2874f0;
              color: white;
              padding: 12px 15px;
              font-weight: 700;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
    
            .items-table td {
              padding: 15px;
              border-bottom: 1px solid #f1f3f4;
              font-size: 13px;
              font-weight: 400;
            }
    
            .item-name {
              font-weight: 700;
              color: #333;
              margin-bottom: 4px;
              letter-spacing: 0.5px;
            }
    
            .item-features {
              font-size: 11px;
              color: #666;
              font-weight: 400;
            }
    
            .item-period {
              text-align: center;
              color: #666;
              font-weight: 400;
            }
    
            .item-amount {
              text-align: right;
              font-weight: 700;
              color: #28a745;
              font-size: 14px;
              letter-spacing: 0.5px;
            }
    
            .totals-section {
              background: #f8f9fa;
              border: 1px solid #e9ecef;
              border-radius: 6px;
              padding: 20px;
              margin-bottom: 25px;
            }
    
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              font-size: 13px;
              font-weight: 400;
            }
    
            .total-row .label {
              color: #666;
              font-weight: 400;
            }
    
            .total-row .value {
              font-weight: 700;
              color: #333;
            }
    
            .grand-total {
              border-top: 2px solid #dee2e6;
              margin-top: 15px;
              padding-top: 15px;
              font-size: 16px !important;
              font-weight: 700 !important;
              letter-spacing: 0.5px;
            }
    
            .grand-total .label {
              color: #333 !important;
              font-size: 15px;
              font-weight: 700;
            }
    
            .grand-total .value {
              color: #28a745 !important;
              font-size: 18px;
              font-weight: 700;
            }
    
            .footer-section {
              text-align: center;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 6px;
              border: 1px solid #e9ecef;
              margin-top: 30px;
            }
    
            .footer-logo {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
            }
    
            .footer-logo img {
              width: 120px;
              height: auto;
              object-fit: contain;
            }
    
            .thank-you {
              font-size: 16px;
              font-weight: 700;
              color: #28a745;
              margin-bottom: 12px;
              letter-spacing: 0.5px;
            }
    
            .footer-text {
              font-size: 11px;
              color: #666;
              line-height: 1.4;
              max-width: 500px;
              margin: 0 auto;
              font-weight: 400;
            }
    
            .security-note {
              background: #e7f3ff;
              color: #0066cc;
              padding: 6px 12px;
              border-radius: 4px;
              font-size: 11px;
              margin-top: 12px;
              display: inline-block;
              font-weight: 700;
              letter-spacing: 0.5px;
            }
    
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .invoice-container {
                padding: 15px;
                max-width: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div class="company-logo">
                <img src="/images/logo/logo.png" alt="WIGGLEBYTE SECURITY" class="logo-img" />
                <div class="company-info">
                  <h1></h1>
                  <p class="tagline">ENTERPRISE-GRADE SECURITY SOLUTIONS</p>
                  <div class="contact">
                    SEC 45 CYBER CITY, GURUGRAM HARYANA <br>
                    WWW.WIGGLEBYTE.COM | +91 9914557798
                  </div>
                </div>
              </div>
              <div class="invoice-meta">
                <h2>INVOICE</h2>
                <p><strong>INVOICE #:</strong> ${data.invoiceNumber}</p>
                <p><strong>DATE:</strong> ${format(data.paymentDate.toDate(), 'dd/MM/yyyy')}</p>
                <div class="status-paid">PAID</div>
              </div>
            </div>
    
            <div class="billing-details">
              <div class="billing-card">
                <h3>BILL TO</h3>
                <div class="customer-name">${data.customerName || 'VALUED CUSTOMER'}</div>
                <p><strong>EMAIL:</strong> <span>${data.customerEmail || 'CUSTOMER@EMAIL.COM'}</span></p>
                <p><strong>CUSTOMER ID:</strong> <span>#${data.customerId || '12345'}</span></p>
                
              </div>
              <div class="billing-card">
                <h3>PAYMENT DETAILS</h3>
                <p><strong>PAYMENT METHOD:</strong> <span>${data.paymentMethod}</span></p>
                <p><strong>TRANSACTION ID:</strong> <span>${data.transactionId}</span></p>
                <p><strong>BILLING STATUS:</strong> <span>${data.billingCycle}</span></p>
                <p><strong>PURCHASES DATE:</strong> <span>${format(data.paymentDate.toDate(), 'dd/MM/yyyy')}</span></p>
              </div>
            </div>
    
            <div class="items-section">
              <table class="items-table">
                <thead>
                  <tr>
                    <th>DESCRIPTION</th>
                    <th>BILLING PERIOD</th>
                    <th>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.items.map((item: any) => `
                    <tr>
                      <td>
                        <div class="item-name">${item.description}</div>
                        <div class="item-features">${item.features || 'PREMIUM SECURITY FEATURES INCLUDED'}</div>
                      </td>
                      <td class="item-period">${data.billingCycle}</td>
                      <td class="item-amount">${data.currency} ${item.amount.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
    
            <div class="totals-section">
              <div class="total-row">
                <span class="label">SUBTOTAL:</span>
                <span class="value">${data.currency} ${data.subtotal.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span class="label">TAX(10%):</span>
                <span class="value">${data.currency} ${data.tax.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span class="label">PROCESSING FEE:</span>
                <span class="value">${data.currency} 0.00</span>
              </div>
              <div class="total-row grand-total">
                <span class="label">TOTAL AMOUNT:</span>
                <span class="value">${data.currency} ${data.total.toFixed(2)}</span>
              </div>
            </div>
    
            <div class="footer-section">
              <div class="footer-logo">
                <img src="/images/logo/logo.png" alt="WIGGLEBYTE" class="logo-img" />
              </div>
              <div class="thank-you">THANK YOU FOR CHOOSING WIGGLEBYTE!</div>
              <div class="footer-text">
                THIS IS A COMPUTER-GENERATED INVOICE AND DOES NOT REQUIRE A PHYSICAL SIGNATURE. 
                <br><br>
                © ${new Date().getFullYear()} WIGGLEBYTE . ALL RIGHTS RESERVED.
              </div>
              <div class="security-note">🔒 DIGITALLY SIGNED & VERIFIED</div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;
      try {
        const history = await getUserPaymentHistory(user.uid);
        setPayments(history);
      } catch (error) {
        console.error('Error fetching payment history:', error);
        toast.error('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  // Loading animation component
  const LoadingPulse = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="space-y-3">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );

  // Loading animation for payment card
  const PaymentCardSkeleton = () => (
    <Card className="overflow-hidden animate-pulse">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </CardContent>
    </Card>
  );

  // Loading animation for auth card
  const AuthCardSkeleton = () => (
    <Card className="w-full max-w-md mx-4 animate-pulse">
      <CardHeader>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          {loading ? (
            <AuthCardSkeleton />
          ) : (
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-center text-red-600">Authentication Required</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Please log in to view your billing logs.
                </p>
                <Button
                  onClick={() => window.location.href = '/login?redirect=history'}
                  className="w-full"
                >
                  Log In
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
              <div className="grid gap-6">
                <PaymentCardSkeleton />
                <PaymentCardSkeleton />
                <PaymentCardSkeleton />
              </div>
            </div>
          ) : payments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  No billing records found.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Billing Logs
              </h1>
              <div className="grid gap-6">
                {payments.map((payment) => (
                  <Card key={payment.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {payment.planType.toUpperCase()} PLAN
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                              payment.status === 'completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : payment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {payment.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {format(payment.paymentDate.toDate(), 'PPP')}
                            </div>
                            <div>
                              Amount: {payment.currency} {payment.amount.toFixed(2)}
                            </div>
                            <div>
                              Billing: {payment.billingCycle}
                            </div>
                            <div>
                              Invoice: {payment.invoiceNumber}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleDownloadInvoice(payment.id!)}
                          disabled={downloading === payment.id || !scriptLoaded}
                          className={`whitespace-nowrap transition-all duration-300 ${
                            downloading === payment.id || !scriptLoaded
                              ? 'opacity-75 cursor-not-allowed'
                              : 'hover:scale-105'
                          }`}
                        >
                          {downloading === payment.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Downloading...
                            </>
                          ) : !scriptLoaded ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Loading PDF Tools...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}