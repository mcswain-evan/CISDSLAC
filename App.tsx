
import React, { useState } from 'react';
import { Book, AppState, GroundingSource } from './types';
import { fetchBookData } from './services/geminiService';
import BookTable from './components/BookTable';
import { DistrictSealLogo, PlusIcon, SparklesIcon, ExclamationTriangleIcon, SearchIcon, BookOpenIcon } from './components/Icons';

function App() {
  const [input, setInput] = useState('');
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [results, setResults] = useState<Book[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!input.trim()) return;
    
    const titles = input
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (titles.length === 0) return;

    setState(AppState.LOADING);
    setError(null);
    
    try {
      const data = await fetchBookData(titles);
      setResults(data.books);
      setSources(data.sources);
      setState(AppState.SUCCESS);
    } catch (err) {
      setError('An error occurred during the compliance review process. Please ensure you have a stable connection and try again.');
      setState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setInput('');
    setResults([]);
    setSources([]);
    setState(AppState.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      {/* Canyon ISD Official Header Bar */}
      <div className="bg-[#841A2B] h-2 w-full"></div>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <DistrictSealLogo className="w-16 h-16 drop-shadow-sm" />
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-[#212121] heading-font tracking-tight leading-none">SLAC HUB</h1>
              <div className="flex items-center mt-1">
                <div className="h-4 w-[2px] bg-[#841A2B] mr-2"></div>
                <p className="text-[12px] text-gray-600 font-bold uppercase tracking-[0.1em]">Canyon Independent School District</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-8 text-[11px] font-bold uppercase tracking-widest text-gray-500">
              <span className="hover:text-[#841A2B] cursor-pointer">Policies</span>
              <span className="hover:text-[#841A2B] cursor-pointer">Resources</span>
              <span className="hover:text-[#841A2B] cursor-pointer">Admin</span>
            </nav>
            {state === AppState.SUCCESS && (
              <button 
                onClick={handleReset}
                className="text-xs font-bold text-[#841A2B] hover:bg-[#841A2B] hover:text-white transition-all px-5 py-2.5 border-2 border-[#841A2B] rounded-sm uppercase tracking-widest"
              >
                New Audit
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        {state === AppState.IDLE || state === AppState.ERROR ? (
          <div className="max-w-4xl mx-auto space-y-14">
            <div className="text-center space-y-5">
              <h2 className="text-5xl sm:text-6xl font-bold text-[#212121] heading-font leading-none tracking-tight">
                Check Your Book's Compliancy
              </h2>
              <div className="flex justify-center items-center space-x-4">
                <div className="w-12 h-0.5 bg-gray-200"></div>
                <p className="text-xl text-gray-500 font-light">Instructional Material Compliance Audit Portal</p>
                <div className="w-12 h-0.5 bg-gray-200"></div>
              </div>
            </div>

            <div className="bg-white p-12 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <label htmlFor="titles" className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                  Material Submission Batch
                </label>
                <span className="text-[10px] font-bold text-[#841A2B] bg-red-50 px-4 py-1.5 rounded-full border border-red-100 uppercase tracking-widest">Live Research Enabled</span>
              </div>
              
              <div className="relative">
                <textarea
                  id="titles"
                  rows={8}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste list of titles here (e.g. The Handmaid's Tale, Gender Queer, etc...)"
                  className="w-full px-8 py-7 rounded-sm border border-gray-200 bg-[#fcfcfc] focus:bg-white focus:border-[#841A2B] focus:ring-0 transition-all outline-none text-gray-800 placeholder-gray-300 font-sans text-xl shadow-inner leading-relaxed"
                />
              </div>
              
              {error && (
                <div className="mt-8 p-5 bg-red-50 text-[#841A2B] rounded-sm flex items-center space-x-4 border-l-4 border-[#841A2B]">
                  <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0" />
                  <p className="text-sm font-bold uppercase tracking-tight">{error}</p>
                </div>
              )}

              <button
                onClick={handleProcess}
                disabled={!input.trim()}
                className="mt-12 w-full bg-[#841A2B] hover:bg-[#212121] disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed text-white font-bold py-6 px-10 rounded-sm shadow-xl transition-all flex items-center justify-center space-x-5 text-2xl heading-font tracking-wider"
              >
                <SparklesIcon className="w-7 h-7" />
                <span>Submit for District Compliance Review</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="group bg-white p-8 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow border-b-4 border-b-gray-200 hover:border-b-[#841A2B]">
                <div className="flex items-center space-x-4 mb-5">
                  <div className="p-3 bg-gray-50 rounded-sm group-hover:bg-[#841A2B] transition-colors">
                    <SearchIcon className="w-6 h-6 text-[#841A2B] group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-[#212121] text-xs uppercase tracking-widest">SB 13 Grounding</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">Automated cross-referencing with Texas SB 13 prohibited material standards and official state databases.</p>
              </div>
              <div className="group bg-white p-8 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow border-b-4 border-b-gray-200 hover:border-b-[#841A2B]">
                <div className="flex items-center space-x-4 mb-5">
                  <div className="p-3 bg-gray-50 rounded-sm group-hover:bg-[#841A2B] transition-colors">
                    <SparklesIcon className="w-6 h-6 text-[#841A2B] group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-[#212121] text-xs uppercase tracking-widest">13-Point Rubric</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">Deep analysis across 13 distinct content categories defined in the Canyon ISD Library Material Review Rubric.</p>
              </div>
              <div className="group bg-white p-8 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow border-b-4 border-b-gray-200 hover:border-b-[#841A2B]">
                <div className="flex items-center space-x-4 mb-5">
                  <div className="p-3 bg-gray-50 rounded-sm group-hover:bg-[#841A2B] transition-colors">
                    <BookOpenIcon className="w-6 h-6 text-[#841A2B] group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-[#212121] text-xs uppercase tracking-widest">Official Record</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">Generates verifiable audit reports ready for instructional material committee (SLAC) oversight sessions.</p>
              </div>
            </div>
          </div>
        ) : state === AppState.LOADING ? (
          <div className="flex flex-col items-center justify-center py-48 space-y-12">
            <div className="relative">
              <div className="w-32 h-32 border-[6px] border-gray-100 border-t-[#841A2B] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <DistrictSealLogo className="w-16 h-16 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-bold text-[#212121] heading-font tracking-tight uppercase">Audit In Progress</h3>
              <p className="text-gray-400 text-xl font-light italic">Conducting deep material search and applying rubric standards...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-14 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-200 pb-10">
              <div className="space-y-3">
                <div className="inline-block bg-[#841A2B] text-white text-[10px] font-black px-3 py-1 uppercase tracking-[0.2em] mb-2">Final Review</div>
                <h2 className="text-5xl font-bold text-[#212121] heading-font tracking-tight">Compliance Audit Report</h2>
                <p className="text-gray-400 text-xl font-light">Comprehensive data evaluation for {results.length} materials.</p>
              </div>
              <button 
                onClick={() => {
                  const csv = [
                    ["Title", "Author", "Pub Date", "Pages", "Elementary Status", "Intermediate Status", "High School Status", "Audit Rationale", "Themes"],
                    ...results.map(b => [
                      b.title, 
                      b.author, 
                      b.pubDate, 
                      b.pageCount, 
                      b.gradeCompliance.elementary.status,
                      b.gradeCompliance.intermediate.status,
                      b.gradeCompliance.highSchool.status,
                      b.complianceReason.replace(/,/g, ';'), 
                      b.themes.join('|')
                    ])
                  ].map(e => e.join(",")).join("\n");
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.setAttribute('href', url);
                  a.setAttribute('download', `CISD_SLAC_AUDIT_${new Date().toISOString().split('T')[0]}.csv`);
                  a.click();
                }}
                className="px-10 py-4 bg-[#212121] hover:bg-[#841A2B] text-white rounded-sm text-[12px] font-bold shadow-xl transition-all heading-font tracking-[0.1em] uppercase"
              >
                Download Official CSV Audit
              </button>
            </div>

            <div className="overflow-hidden bg-white rounded-sm border border-gray-200 shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
              <BookTable books={results} />
            </div>

            {sources.length > 0 && (
              <div className="bg-white p-12 rounded-sm border border-gray-100 shadow-sm">
                <h3 className="text-[11px] font-black text-gray-400 mb-8 flex items-center uppercase tracking-[0.3em]">
                  <div className="w-10 h-10 bg-gray-50 rounded-sm flex items-center justify-center mr-5 border border-gray-100">
                    <SearchIcon className="w-5 h-5 text-[#841A2B]" />
                  </div>
                  Grounding Verification Sources
                </h3>
                <div className="flex flex-wrap gap-5">
                  {sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3.5 bg-[#fcfcfc] border border-gray-200 rounded-sm text-[13px] text-[#212121] hover:border-[#841A2B] hover:text-[#841A2B] transition-all font-bold shadow-sm"
                    >
                      {source.title || "External Audit Link"}
                      <svg className="w-4 h-4 ml-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Official District Style Footer */}
      <footer className="bg-[#1a1a1a] text-gray-500 py-24 mt-32 border-t-8 border-[#841A2B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-white/5 pb-20 mb-12">
            <div className="col-span-1 md:col-span-1 space-y-8">
              <div className="flex flex-col space-y-4">
                <DistrictSealLogo className="w-20 h-20 grayscale opacity-50 brightness-200" />
                <span className="text-2xl font-bold text-white heading-font tracking-widest">SLAC HUB</span>
              </div>
              <p className="text-sm leading-loose opacity-60">
                Instructional Materials Oversight Platform for the Canyon Independent School District. Ensuring academic excellence and material compliance.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold heading-font mb-8 text-sm uppercase tracking-[0.2em]">Compliance</h4>
              <ul className="space-y-5 text-xs font-bold uppercase tracking-widest">
                <li><span className="hover:text-[#841A2B] cursor-pointer transition-colors">EF Policy (Local)</span></li>
                <li><span className="hover:text-[#841A2B] cursor-pointer transition-colors">Texas SB 13 Info</span></li>
                <li><span className="hover:text-[#841A2B] cursor-pointer transition-colors">Material Rubric</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold heading-font mb-8 text-sm uppercase tracking-[0.2em]">Department</h4>
              <ul className="space-y-5 text-xs font-bold uppercase tracking-widest">
                <li><span className="hover:text-[#841A2B] cursor-pointer transition-colors">Curriculum & Instruction</span></li>
                <li><span className="hover:text-[#841A2B] cursor-pointer transition-colors">Library Services</span></li>
                <li><span className="hover:text-[#841A2B] cursor-pointer transition-colors">Board of Trustees</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold heading-font mb-8 text-sm uppercase tracking-[0.2em]">District Office</h4>
              <ul className="space-y-5 text-[11px] font-medium leading-relaxed">
                <li className="text-gray-400">3301 N. 23rd St.<br/>Canyon, TX 79015</li>
                <li>Phone: (806) 677-2600</li>
                <li>Email: slac-review@canyonisd.net</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] uppercase tracking-[0.25em] font-black">
            <p>&copy; {new Date().getFullYear()} Canyon ISD SLAC HUB • Empowering Educational Excellence</p>
            <div className="flex space-x-12">
              <span className="hover:text-white cursor-pointer transition-colors">District Accessibility</span>
              <span className="hover:text-white cursor-pointer transition-colors">Staff Portal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
