
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LifeBuoy, Mail, Phone } from "lucide-react";

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">
                Support
            </h1>
            <p className="text-muted-foreground">
                Get help with any issues or questions you have.
            </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>
                    We're here to help. Reach out to us through any of the channels below.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Email Support</h3>
                        <p className="text-muted-foreground">
                            Best for non-urgent inquiries. We'll get back to you within 24 hours.
                        </p>
                        <a href="mailto:support@finsim.com" className="text-primary font-medium">
                            support@finsim.com
                        </a>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Phone Support</h3>
                        <p className="text-muted-foreground">
                           Available from 9 AM to 5 PM EST, Monday to Friday.
                        </p>
                        <a href="tel:+1-800-555-0199" className="text-primary font-medium">
                            +1 (800) 555-0199
                        </a>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <LifeBuoy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Help Center</h3>
                        <p className="text-muted-foreground">
                           Find answers to frequently asked questions and read our guides.
                        </p>
                         <a href="#" className="text-primary font-medium">
                            Visit Help Center
                        </a>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
