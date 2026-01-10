import Layout from "@/components/Layout";
import { FileText, CheckCircle, AlertCircle, Scale, Users, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="bg-primary/5 border-b border-border/40">
          <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
                <p className="text-foreground/70 mt-1">Last updated: November 2024</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <p>
                By accessing and using EcoWardrobe AI, you accept and agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our platform.
              </p>
              <p>
                These terms apply to all users, including visitors, registered members, and contributors to our
                community features.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <p>To access certain features, you must create an account. You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
                <li>Not share your account with others</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Acceptable Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Post harmful, offensive, or inappropriate content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools to scrape or collect data</li>
                <li>Engage in fraudulent marketplace transactions</li>
                <li>Impersonate others or misrepresent your identity</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                AI Services Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <p>
                Our AI-powered features provide suggestions and recommendations based on algorithms and machine learning.
                While we strive for accuracy:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI suggestions are for informational purposes only</li>
                <li>We do not guarantee the accuracy of AI-generated content</li>
                <li>Users should exercise their own judgment</li>
                <li>We are not liable for decisions made based on AI recommendations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-primary" />
                Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <p>
                We reserve the right to suspend or terminate your account if you violate these terms or engage in
                activities that harm our platform or community.
              </p>
              <p>
                You may also terminate your account at any time through your profile settings. Upon termination,
                your data will be handled according to our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <p>
                EcoWardrobe AI is provided "as is" without warranties of any kind. We are not liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of data or profits</li>
                <li>Service interruptions or errors</li>
                <li>Third-party content or actions</li>
                <li>Marketplace transaction disputes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/80">
              <p>
                We may modify these Terms of Service at any time. Continued use of the platform after changes
                constitutes acceptance of the new terms. We will notify users of significant changes via email
                or platform notifications.
              </p>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground pt-8 border-t">
            <p>
              For questions about these Terms of Service, contact us at legal@ecowardrobe.ai
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
