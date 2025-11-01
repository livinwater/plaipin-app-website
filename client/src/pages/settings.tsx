import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Settings</h1>
        <p className="text-muted-foreground">Customize your Plaipin experience</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Companion Settings</CardTitle>
            <CardDescription>Manage your AI companion preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companion-name" data-testid="label-companion-name">Companion Name</Label>
              <Input id="companion-name" defaultValue="Buddy" data-testid="input-companion-name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personality" data-testid="label-personality">Personality Type</Label>
              <Select defaultValue="playful">
                <SelectTrigger id="personality" data-testid="select-personality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="playful">Playful</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="curious">Curious</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what updates you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" data-testid="label-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates about your companion</p>
              </div>
              <Switch 
                id="notifications" 
                checked={notifications}
                onCheckedChange={setNotifications}
                data-testid="switch-notifications"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound-effects" data-testid="label-sound-effects">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">Play sounds for interactions</p>
              </div>
              <Switch 
                id="sound-effects" 
                checked={soundEffects}
                onCheckedChange={setSoundEffects}
                data-testid="switch-sound-effects"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" data-testid="label-email">Email Address</Label>
              <Input id="email" type="email" placeholder="your@email.com" data-testid="input-email" />
            </div>
            
            <div className="flex gap-2">
              <Button data-testid="button-save-settings">Save Changes</Button>
              <Button variant="outline" data-testid="button-cancel">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
