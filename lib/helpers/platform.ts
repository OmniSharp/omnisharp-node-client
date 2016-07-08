import child_process from "child_process";

export enum SupportedPlatform {
    None,
    Windows,
    OSX,
    CentOS,
    Debian,
    Fedora,
    OpenSUSE,
    RHEL,
    Ubuntu14,
    Ubuntu16
}

/* tslint:disable:quotemark */
export function getSupportedPlatform(platform: string = process.platform) {
    if (process.platform === 'win32') {
        return SupportedPlatform.Windows;
    } else if (process.platform === 'darwin') {
        return SupportedPlatform.OSX;
    } else if (process.platform === 'linux') {
        // Get the text of /etc/os-release to discover which Linux distribution we're running on.
        // For details: https://www.freedesktop.org/software/systemd/man/os-release.html
        const text = child_process.execSync('cat /etc/os-release').toString();
        const lines = text.split('\n');

        function getValue(name: string) {
            for (let line of lines) {
                line = line.trim();
                if (line.startsWith(name)) {
                    const equalsIndex = line.indexOf('=');
                    if (equalsIndex >= 0) {
                        let value = line.substring(equalsIndex + 1);

                        // Strip double quotes if necessary
                        if (value.length > 1 && value.startsWith('"') && value.endsWith('"')) {
                            value = value.substring(1, value.length - 1);
                        }

                        return value;
                    }
                }
            }

            return undefined;
        }

        const id = getValue("ID");

        console.log(lines);
        console.log("getValue(\"ID\")", id);

        let result: SupportedPlatform;

        switch (id) {
            case 'ubuntu':
                const versionId = getValue("VERSION_ID");
                console.log("getValue(\"VERSION_ID\")", versionId);
                if (versionId.startsWith("14")) {
                    // This also works for Linux Mint
                    result = SupportedPlatform.Ubuntu14;
                } else if (versionId.startsWith("16")) {
                    result =  SupportedPlatform.Ubuntu16;
                }
                break;
            case 'centos':
                result =  SupportedPlatform.CentOS;
                break;
            case 'fedora':
                result =  SupportedPlatform.Fedora;
                break;
            case 'opensuse':
                result =  SupportedPlatform.OpenSUSE;
                break;
            case 'rehl':
                result =  SupportedPlatform.RHEL;
                break;
            case 'debian':
                result =  SupportedPlatform.Debian;
                break;
            case 'ol':
                // Oracle Linux is binary compatible with CentOS
                result =  SupportedPlatform.CentOS;
                break;
        }

        console.log("getSupportedPlatform result", id, SupportedPlatform[id]);
        return result;
    }

    return SupportedPlatform.None;
}
/* tslint:enable:quotemark */

export const supportedPlatform = getSupportedPlatform(process.platform);
