import EventForm from "@/components/EventForm";

export default function CreateEventPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold text-gray-900">Create a new event</h1>
      <p className="mt-1 text-sm text-gray-500">
        Fill in the details below — you can edit everything later.
      </p>
      <div className="mt-6">
        <EventForm />
      </div>
    </div>
  );
}
