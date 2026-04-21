import React from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Users, Database, Clock, Save } from '@/lib/icons';

const AdminSettings = () => {
  return (
    <>
      <Helmet>
        <title>Admin Settings - Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">System Settings</h1>

          <div className="space-y-8">
            {/* Admins */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                     <Users className="w-6 h-6" />
                  </div>
                  <div>
                     <h2 className="text-lg font-semibold text-gray-900">Admin Management</h2>
                     <p className="text-sm text-gray-500">Manage who has access to this dashboard</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">AD</div>
                        <div>
                           <div className="font-medium text-gray-900">Admin User</div>
                           <div className="text-xs text-gray-500">admin@frankfurtexpatservices.com</div>
                        </div>
                     </div>
                     <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                  </div>
                  {/* Mock data for visual completeness */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-60">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">JD</div>
                        <div>
                           <div className="font-medium text-gray-900">John Doe</div>
                           <div className="text-xs text-gray-500">john@example.com</div>
                        </div>
                     </div>
                     <button className="text-xs text-blue-600 hover:underline">Invite Pending</button>
                  </div>
               </div>
            </div>

            {/* Versioning & Logs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                     <Clock className="w-6 h-6" />
                  </div>
                  <div>
                     <h2 className="text-lg font-semibold text-gray-900">Audit Log & Versioning</h2>
                     <p className="text-sm text-gray-500">Track changes to the task registry</p>
                  </div>
               </div>

               <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                           <td className="px-4 py-3 text-sm text-gray-900">Updated 'Anmeldung' Task</td>
                           <td className="px-4 py-3 text-sm text-gray-500">admin@...</td>
                           <td className="px-4 py-3 text-sm text-gray-500">2 mins ago</td>
                        </tr>
                        <tr>
                           <td className="px-4 py-3 text-sm text-gray-900">System Backup Created</td>
                           <td className="px-4 py-3 text-sm text-gray-500">System</td>
                           <td className="px-4 py-3 text-sm text-gray-500">1 hour ago</td>
                        </tr>
                        <tr>
                           <td className="px-4 py-3 text-sm text-gray-900">Imported Registry v1.2</td>
                           <td className="px-4 py-3 text-sm text-gray-500">admin@...</td>
                           <td className="px-4 py-3 text-sm text-gray-500">Yesterday</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

            {/* General Config */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                     <Database className="w-6 h-6" />
                  </div>
                  <div>
                     <h2 className="text-lg font-semibold text-gray-900">Registry Configuration</h2>
                     <p className="text-sm text-gray-500">Global settings for task generation</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700">Default Priority</label>
                     <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md border">
                        <option>Medium</option>
                        <option>Low</option>
                        <option>High</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700">Auto-Backup Frequency</label>
                     <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md border">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Disabled</option>
                     </select>
                  </div>
               </div>
               
               <div className="mt-6 flex justify-end">
                  <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
                     <Save className="w-4 h-4 mr-2" /> Save Settings
                  </button>
               </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;