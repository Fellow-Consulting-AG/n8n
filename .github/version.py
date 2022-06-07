import os

hotfix = False

action = os.getenv("ACTION")
if not action:
    raise Exception("Env ACTION is missing")

version_file = os.getenv("CORE_VERSION_FILE")
if version_file == None:
    version_file = os.getenv("version_file")
if not version_file:
    version_file = "version.txt"

if action.lower() == "pass":
    action = "pass"

if action.lower() in ["version-update", "patch"]:
    action = "patch"

if action.lower() == "hotfix":
    action = "hotfix"
    hotfix = True

print(action)

class VersionError(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)

class VersionNumberWrongFormat(VersionError):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class VerisonHandler:
    
    def __init__(self, path, hotfix: bool = False) -> None:

        self.path = path
        self.hotfix_enabled = hotfix

        raw_data = self.load_file(path)

        self.major  =   int(raw_data[0])
        self.minor  =   int(raw_data[1])
        self.patch  =   int(raw_data[2])
        self.hotfix =   int(raw_data[3])

        self.version = f"{self.major}.{self.minor}.{self.patch}"
        
    def update(func):
        def wrapper(self, *args, **kwargs):
                func(self, *args, **kwargs)
                self.version = f"{self.major}.{self.minor}.{self.patch}"
                if self.hotfix_enabled:
                    self.version += f".{self.hotfix}"
                
        
        return wrapper

    @staticmethod
    def load_file(path):
        if not os.path.isfile(path):
            raise FileNotFoundError
        with open(path, "r") as file:
            raw_data = file.readline().rstrip("\n").rstrip(" ").split(".")

            if len(raw_data) > 4:
                raise VersionNumberWrongFormat(message = "version number is to long! It may contain at max 4 seperated (by a .) versions indicators")
        
            while len(raw_data) < 4:
                raw_data.append('0')

        return raw_data

    @update
    def increment(self, attribute: str):
        try:
            setattr(self, attribute, getattr(self, attribute) + 1)
        except AttributeError as e:
            print(e)
        

    def save(self):
        with open(self.path, "w") as file:
            file.write(self.version)


# hotfix = True        

version = VerisonHandler(path=version_file, hotfix=hotfix)


if action == "patch":
    version.increment("patch")
elif action == "hotfix":
    version.increment("hotfix")
else:
    print("passed version update")
    
# more options possible
version.save()
os.system(f'echo "CurrentVersion={version.version}"')# >> $GITHUB_ENV')


