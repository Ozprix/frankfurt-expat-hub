import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from '@/lib/motion';
import { FileText, CheckCircle, Circle, Download } from '@/lib/icons';
import { useDocuments } from '@/hooks/useDocuments';
import { useToast } from '@/components/ui/use-toast';
import { buildDocumentChecklistTemplate, downloadPDF } from '@/utils/pdfGenerator';

const DocumentsPage = () => {
  const { documents, toggleDocumentReady, updateDocument, getReadyCount } = useDocuments();
  const { toast } = useToast();

  const readyCount = getReadyCount();
  const progress = Math.round((readyCount / documents.length) * 100);

  const handleExportPDF = async () => {
    try {
      await downloadPDF(buildDocumentChecklistTemplate(documents));
      toast({
        title: "PDF exported",
        description: "Your document checklist PDF has been generated.",
      });
    } catch (error) {
      console.error('Document PDF export failed:', error);
      toast({
        title: "PDF export failed",
        description: "Please try again after refreshing the page.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Documents | Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Track and manage all required documents for your Frankfurt relocation in one organized place." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Document Tracker</h1>
            <p className="text-lg text-gray-600">
              Keep track of all required documents for your relocation
            </p>
          </div>

          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Document Progress</h2>
              <span className="text-3xl font-bold text-teal-600">{readyCount}/{documents.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">{progress}% of documents ready</p>
          </motion.div>

          {/* Export Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleExportPDF}
              className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Export as PDF
            </button>
          </div>

          {/* Document Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <FileText className="w-6 h-6 text-teal-600 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{doc.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleDocumentReady(doc.id)}
                    className="flex-shrink-0"
                  >
                    {doc.ready ? (
                      <CheckCircle className="w-8 h-8 text-green-600 fill-green-600" />
                    ) : (
                      <Circle className="w-8 h-8 text-gray-300 hover:text-teal-600 transition-colors" />
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className={`px-4 py-2 rounded-lg ${
                      doc.ready 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-gray-50 text-gray-600 border border-gray-200'
                    }`}>
                      {doc.ready ? 'Ready' : 'Not Ready'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={doc.notes}
                      onChange={(e) => updateDocument(doc.id, { notes: e.target.value })}
                      placeholder="Add notes about this document..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent resize-none text-gray-900"
                      rows="3"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentsPage;
