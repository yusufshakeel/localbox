export default function UserCannotDeleteUploadedFile() {
  return (
    <div className="my-5 text-sm text-muted-foreground">
      <p>Any files uploaded here are visible to other users.</p>
      <p>Contact Admin to remove a file.</p>
    </div>
  );
}