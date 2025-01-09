import Image from 'next/image';
import BaseLayout from '@/layouts/BaseLayout';
import {useAppContext} from '@/context/AppContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {WEBSITE_NAME, YUSUF_SHAKEEL_WEBSITE_URL} from '@/constants';
import {Pages} from '@/configs/pages';

export default function InfoPage() {
  const {ip, port, localServerAddress, info} = useAppContext();

  return (
    <BaseLayout pageTitle={Pages.info.title}>
      <div className="grid gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Key</TableHead>
              <TableHead className="font-bold">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>{info?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>{info?.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Version</TableCell>
              <TableCell>{info?.version}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Author</TableCell>
              <TableCell>
                <a className="font-medium text-blue-700"
                  href={YUSUF_SHAKEEL_WEBSITE_URL}>{info?.author}</a>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>GitHub</TableCell>
              <TableCell>
                <a className="font-medium text-blue-700"
                  href={info?.homepage}>{info?.homepage}</a>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>License</TableCell>
              <TableCell>
                <a className="font-medium text-blue-700"
                  href={info?.licensePage}>{info?.license}</a>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Local Server IP</TableCell>
              <TableCell>{ip}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Local Server Port</TableCell>
              <TableCell>{port}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Local Server Address</TableCell>
              <TableCell>
                <a className="font-medium text-blue-700"
                  href={localServerAddress}>{localServerAddress}</a>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="my-5">
          <h2 className="font-bold text-3xl mb-4">FAQ</h2>

          <h3 className="font-bold text-2xl my-3">What is {WEBSITE_NAME}?</h3>
          <p>{WEBSITE_NAME} is a simple application that acts as a file storage and
            sharing system for devices connected to a given network.</p>

          <h3 className="font-bold text-2xl my-3">What are the use cases of this application?</h3>
          <p>Imagine you’re at home or in an office:</p>

          <ul className="my-3 ml-6 list-disc [&>li]:mt-2">
            <li>You can quickly share files like photos, documents, or videos between
              your phone and computer without using cloud services (e.g., Google
              Drive or Dropbox).
            </li>
            <li>Any device on the same Wi-Fi network can interact with the Local Box
              to upload files or retrieve hosted files.
            </li>
          </ul>

          <h3 className="font-bold text-2xl my-3">Server Clients</h3>
          <p>The computer that is running this application will act like the server.
            A local IP address (like 192.168.0.151) will be displayed.
            Clients (other users) can connect to that IP address via browsers.</p>

          <Image src="/assets/server-clients.png?v=1"
            className="my-3"
            width={320}
            height={320}
            alt=""/>

          <h3 className="font-bold text-2xl my-3">What is the server address?</h3>
          <p>{ip}</p>

          <h3 className="font-bold text-2xl my-3">How to connect to the server?</h3>
          <p>If the server IP is 192.168.0.151 and is running at port 3001 then
            type <strong>http://192.168.0.151:3001</strong> in the browser.</p>
        </div>
      </div>
    </BaseLayout>
  );
}