export default function UserCannotDeleteUploadedFile() {
  return (
    <div className="my-3 text-sm text-muted-foreground">
      <p>Any files uploaded here are visible to other users.</p>
      <p>Contact the Admin to remove a file.</p>
    </div>
  );
}