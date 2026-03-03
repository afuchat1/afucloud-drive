import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const ContactPage = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    form.reset();
    toast({
      title: "Message sent",
      description: "Thanks for reaching out — we’ll get back to you shortly.",
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-5xl px-6 py-16 lg:py-24">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Contact us</h1>
            <p className="mt-3 text-muted-foreground">Tell us what you need and we’ll get back to you.</p>
          </div>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back home
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
              <CardDescription>We usually reply within one business day.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Your name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@company.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="How can we help?" required />
                </div>

                <Button type="submit" className="w-full sm:w-auto">Send message</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact details</CardTitle>
              <CardDescription>Prefer direct contact? Reach us here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@afuchat.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +1 (555) 012-3456
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Remote-first team
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
