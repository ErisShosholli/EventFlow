import EventForm from "@/components/EventForm";

export default function CreateEventPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl font-semibold text-foreground">
        Create a new event
      </h1>
      <p className="mt-1.5 text-sm text-stone-500">
        Fill in the details below — you can edit everything later.
      </p>
      <div className="mt-6">
        <EventForm />
      </div>
    </div>
  );
}
