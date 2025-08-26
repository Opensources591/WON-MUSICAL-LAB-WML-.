"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, AlertTriangle, RefreshCw, Play, Download } from 'lucide-react'
import { runCompleteTestSuite, type TestSuite, type TestResult } from '@/lib/test-suite'

export function TestDashboard() {
  const [testResults, setTestResults] = useState<TestSuite | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [lastRun, setLastRun] = useState<Date | null>(null)

  const runTests = async () => {
    setIsRunning(true)
    try {
      const results = await runCompleteTestSuite()
      setTestResults(results)
      setLastRun(new Date())
    } catch (error) {
      console.error('Error running test suite:', error)
    } finally {
      setIsRunning(false)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pass: 'default' as const,
      fail: 'destructive' as const,
      warning: 'secondary' as const,
    }
    
    const labels = {
      pass: 'Pass',
      fail: 'Fail',
      warning: 'Warning',
    }

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const renderTestSection = (title: string, tests: TestResult[], icon: React.ReactNode) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>
          {tests.filter(t => t.status === 'pass').length} passed, {' '}
          {tests.filter(t => t.status === 'fail').length} failed, {' '}
          {tests.filter(t => t.status === 'warning').length} warnings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <p className="font-medium text-sm">{test.name}</p>
                  <p className="text-xs text-muted-foreground">{test.message}</p>
                  {test.details && (
                    <details className="mt-1">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        View details
                      </summary>
                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
              {getStatusBadge(test.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const calculateOverallStatus = () => {
    if (!testResults) return null
    
    const allTests = [
      ...testResults.environment,
      ...testResults.authentication,
      ...testResults.voiceGeneration,
      ...testResults.cloudStorage,
      ...testResults.ui,
    ]
    
    const passed = allTests.filter(t => t.status === 'pass').length
    const failed = allTests.filter(t => t.status === 'fail').length
    const warnings = allTests.filter(t => t.status === 'warning').length
    const total = allTests.length
    
    return {
      passed,
      failed,
      warnings,
      total,
      successRate: Math.round((passed / total) * 100),
      isReady: failed === 0 && passed > 0
    }
  }

  const downloadReport = () => {
    if (!testResults) return
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: calculateOverallStatus(),
      results: testResults
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `revnet-labs-test-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const overallStatus = calculateOverallStatus()

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">RevNet Labs - Complete Test Suite</CardTitle>
              <CardDescription>
                Comprehensive testing of all systems and integrations
                {lastRun && (
                  <span className="block mt-1">
                    Last run: {lastRun.toLocaleString()}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={downloadReport} variant="outline" size="sm" disabled={!testResults}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button onClick={runTests} disabled={isRunning} size="sm">
                {isRunning ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {isRunning ? 'Running Tests...' : 'Run Tests'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {overallStatus && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{overallStatus.passed}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{overallStatus.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{overallStatus.warnings}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{overallStatus.total}</div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{overallStatus.successRate}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-lg border">
              {overallStatus.isReady ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">🎉 System is ready for deployment!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">⚠️ System has issues that need to be resolved before deployment</span>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Loading State */}
      {isRunning && !testResults && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-lg font-medium">Running comprehensive tests...</p>
              <p className="text-sm text-muted-foreground">This may take a few moments</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testResults && (
        <div className="grid gap-6">
          {renderTestSection(
            'Environment Variables',
            testResults.environment,
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">E</span>
            </div>
          )}
          
          {renderTestSection(
            'Authentication System',
            testResults.authentication,
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">A</span>
            </div>
          )}
          
          {renderTestSection(
            'Voice Generation',
            testResults.voiceGeneration,
            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">V</span>
            </div>
          )}
          
          {renderTestSection(
            'Cloud Storage',
            testResults.cloudStorage,
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">C</span>
            </div>
          )}
          
          {renderTestSection(
            'UI Components',
            testResults.ui,
            <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">U</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
