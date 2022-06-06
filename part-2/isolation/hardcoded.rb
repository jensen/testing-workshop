require_relative "./deps.rb"

class Uploader
  def initialize(local = true)
    @storage = local ? FileSystem.new : S3.new
  end

  def upload
    @storage.save
  end
end

RSpec.describe Uploader do
  context "local" do
    subject { described_class.new(true) }
    
    let(:adapter) { instance_double(FileSystem) }

    before do
      allow(adapter).to receive(:save) { "saved to mocked adapter" }
      allow(FileSystem).to receive(:new) { adapter }
    end

    describe '#upload' do
      it "saves the file" do
        expect(subject.upload).to eq("saved to mocked adapter")
      end
    end
  end

  context "remote" do
    subject { described_class.new(false) }
    
    before do
      allow_any_instance_of(S3).to receive(:save) { "saved to mocked adapter" }
    end

    describe '#upload' do
      it "saves the file" do
        expect(subject.upload).to eq("saved to mocked adapter")
      end
    end
  end
end